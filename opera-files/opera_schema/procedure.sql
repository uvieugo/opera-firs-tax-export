create or replace PROCEDURE CLS_POST_FOLIO_DATA
( 
  resv_id in varchar2,
  room_num in varchar2,
  net_total in number,
  gross_total in number,
  tax_total_1 in number,
  tax_total_2 in number,
  tax_total_3 in number,
  tax_total_4 in number,
  tax_total_5 in number
) AS
  req utl_http.req;
  res utl_http.resp;
  url varchar2(100) := 'http://localhost:8000';
  x_clob CLOB;
  t_response varchar2(4000);
  buffer varchar2(4000);
  content varchar2(4000) := '{
			"net_total":"'||net_total||'", 
			"gross_total":"'||gross_total||'",
			"tax_total_1":"'||tax_total_1||'",
			"tax_total_2":"'||tax_total_2||'",
			"tax_total_3":"'||tax_total_3||'",
			"tax_total_4":"'||tax_total_4||'",
			"tax_total_5":"'||tax_total_5||'",
            "room_num":"'||room_num||'"
		}';
BEGIN
  req := utl_http.begin_request(url, 'GET',' HTTP/1.1');
  utl_http.set_header(req, 'user-agent', 'mozilla/4.0'); 
  utl_http.set_header(req, 'content-type', 'application/json'); 
  utl_http.set_header(req, 'Content-Length', length(content));
  utl_http.write_text(req, content);
  res := utl_http.get_response(req);
  
  LOOP
    UTL_HTTP.READ_text(res, buffer);
    update cls_tax_export set response=buffer where resv_name_id=resv_id;
  END LOOP;
  UTL_HTTP.END_RESPONSE(res);
  exception
    when utl_http.end_of_body 
    then
      utl_http.end_response(res);
end cls_post_folio_data;