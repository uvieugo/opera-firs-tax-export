create or replace TRIGGER cls_get_folio_data
AFTER UPDATE OF RESV_STATUS ON RESERVATION_NAME
FOR EACH ROW
DECLARE
  t_conf_num varchar2(255);
  t_resv_name_id varchar2(255);
  t_room_num varchar2(255);
  t_net_total varchar2(255);
  t_gross_total varchar2(255);
  t_tax_total_1 varchar2(255);
  t_tax_total_2 varchar2(255);
  t_tax_total_3 varchar2(255);
  t_tax_total_4 varchar2(255);
  t_tax_total_5 varchar2(255);
  v_count number;
BEGIN
  IF UPDATING AND (:new.resv_status='CHECKED OUT') THEN
  select count(*) into v_count from folio$_tax where RESV_NAME_ID=:new.resv_name_id;
  if v_count >= 1 then
    SELECT
       ROOM,TOTAL_NET,TOTAL_GROSS,TAX1_AMT,TAX2_AMT,TAX3_AMT,TAX4_AMT,TAX5_AMT
    INTO
       t_room_num,t_net_total,t_gross_total,t_tax_total_1,t_tax_total_2,t_tax_total_3,t_tax_total_4,t_tax_total_5
    FROM
       FOLIO$_TAX
    WHERE
       RESV_NAME_ID=:new.resv_name_id;

    INSERT INTO cls_tax_export (conf_num,resv_name_id,room_num,net_total,gross_total,tax_total_1,tax_total_2,tax_total_3,tax_total_4,tax_total_5)
    VALUES (:new.confirmation_no,:new.resv_name_id,t_room_num,t_net_total,t_gross_total,t_tax_total_1,t_tax_total_2,t_tax_total_3,t_tax_total_4,t_tax_total_5);
    cls_post_folio_data(:new.resv_name_id,t_room_num,t_net_total,t_gross_total,t_tax_total_1,t_tax_total_2,t_tax_total_3,t_tax_total_4,t_tax_total_5);
    end if;
  END IF;
END;