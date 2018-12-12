#Launch Excel
$Excel = New-Object -ComObject "Excel.Application"
$OutputFilePath = ""
$OutputWorkbook = $Excel.Workbooks.Add()
$OutputSheet = $OutputWorkbook.Worksheets.Item("Sheet1")
$fpBuilderDate = (Get-Date).ToString('yyyy.MM.dd-')
$OutputSheet.Cells.Item(1,1).Value() = $fpBuilderDate

$fpBuilderCounter = 1
Do {
    $OutputFilePath = -join("V:\robotics\pybot\test_archive\",$fpBuilderDate,$fpBuilderCounter,".xlsx")
    $fpBuilderCounter++
} While(Test-Path $OutputFilePath) 
$OutputWorkbook.SaveAs($OutputFilePath)  
$OutputWorkbook.Close()
$Excel.Quit()   