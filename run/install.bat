@ECHO OFF

set curr_dir=%cd%

nssm install "Firs Tax" %curr_dir%\start.bat

nssm set "Firs Tax" DisplayName "Firs Tax"

nssm set "Firs Tax" Description "Firs Tax Export Server"
