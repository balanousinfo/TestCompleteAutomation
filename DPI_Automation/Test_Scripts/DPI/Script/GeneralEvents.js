﻿//USEUNIT common
//USEUNIT utilities
function GeneralEvents_OnStartTest(Sender)
{
//  SelectEnvironment();
  TestEnvironmentInfo();
  LoadTestDataFile();
  MyExtentReport();
  
}


function LoadTestDataFile()
{
  var strBrowserName, strMozartURL, strLoginName, strUsername, strPassword, strIPSheetName;
      
//  var strExecEnvironment        = "QA" //##################################
  var strExecEnvironment        = Project.Variables.TestEnvironment;
  var strPrjSuitePath           = ProjectSuite.Path
  var strPrjSuiteName           = ProjectSuite.FileName
  var strSuiteNameWithExt       = aqString.Replace(strPrjSuiteName, strPrjSuitePath, "");
  var strSuiteNameWithOutExt    = aqString.Replace(strSuiteNameWithExt, ".pjs", "");
  var strTestScriptsFolderPath  = aqString.Replace(strPrjSuitePath, strSuiteNameWithOutExt + "\\", "");
  var strTestDataFolderPath     = aqString.Replace(strTestScriptsFolderPath, "Test_Scripts\\", "Test_Data\\");
  var strTestDataFilePath       = strTestDataFolderPath + "Test_Data.xlsx";
  
  var objExcelFile              = Excel.Open(strTestDataFilePath);
  var objGlobalSheet            = objExcelFile.SheetByTitle("Global");  

  switch (strExecEnvironment)
  {
    case  "TEST": 
      strBrowserName    = objGlobalSheet.CellByName("B2").Value;
      strMozartURL      = objGlobalSheet.CellByName("B3").Value;
      strLoginName      = objGlobalSheet.CellByName("B4").Value;
      strUsername       = objGlobalSheet.CellByName("B5").Value;
      strPassword       = objGlobalSheet.CellByName("B6").Value;
      strIPSheetName    = objGlobalSheet.CellByName("B7").Value;
      break;
    case "QA":
      strBrowserName    = objGlobalSheet.CellByName("C2").Value;
      strMozartURL      = objGlobalSheet.CellByName("C3").Value;
      strEnoviaURL      = objGlobalSheet.CellByName("C4").Value;
      strUsername       = objGlobalSheet.CellByName("C5").Value;
      strPassword       = objGlobalSheet.CellByName("C6").Value;
      strIPSheetName    = objGlobalSheet.CellByName("C7").Value;
      break;
    case "PROD":
      Log.Warning("Execution setup is not yet done.")
      break;
  }
   

  var objTestDataSheet  = objExcelFile.SheetByTitle(strIPSheetName);
  var gcas_1  = objTestDataSheet.CellByName("B2").Value;
  var gcas_2 = objTestDataSheet.CellByName("B3").Value;
  var gcas_3  = objTestDataSheet.CellByName("B4").Value;
  var gcas_4 = objTestDataSheet.CellByName("B5").Value;
  var gcas_5 = objTestDataSheet.CellByName("B6").Value;
  var gcas_2Version     = objTestDataSheet.CellByName("B7").Value;
  var products1 = objTestDataSheet.CellByName("B8").Value;
  var products2 = objTestDataSheet.CellByName("B9").Value;
  var products_invalid = objTestDataSheet.CellByName("B10").Value;
  var prd_twoReleaseState = objTestDataSheet.CellByName("B11").Value;
  var products3 = objTestDataSheet.CellByName("B12").Value;
  var newFilterValue = objTestDataSheet.CellByName("B13").Value;
  
  utilities.LoginData = {
    BrowserName : strBrowserName,
    MozartURL   : strMozartURL,
    EnoviaURL   : strEnoviaURL,
    Username    : strUsername,
    Password    : strPassword,
    InputSheet  : strIPSheetName
  }
  
  utilities.ExecData = {
    gcas_1   : gcas_1,
    gcas_2   : gcas_2,
    gcas_3   : gcas_3,
    gcas_4   : gcas_4,
    gcas_5   : gcas_5,
    gcas_2Version   : gcas_2Version,
    products1   : products1,
    gcas_3   : gcas_3,
    products2   : products2,
    products_invalid   : products_invalid,
    prd_twoReleaseState   : prd_twoReleaseState,
    products3   : products3,
    newFilterValue:newFilterValue
  }
  
  
  
}


function MyExtentReport() 
{
  
  var strProjectName            = "dPI_Automation";
  var strPrjSuitePath           = ProjectSuite.Path
  var strPrjSuiteName           = ProjectSuite.FileName
  var strSuiteNameWithExt       = aqString.Replace(strPrjSuiteName, strPrjSuitePath, "");
  var strSuiteNameWithOutExt    = aqString.Replace(strSuiteNameWithExt, ".pjs", "");
  var strTestScriptsFolderPath  = aqString.Replace(strPrjSuitePath, strSuiteNameWithOutExt + "\\", "");
  var strResultsFolderPath = aqString.Replace(strTestScriptsFolderPath, "Test_Scripts\\", "Test_Results\\Extent_Reports\\");
  
  var timeStamp = GetTimeStamp()
  var strReportName       = "Extent_" + strProjectName + "_" + timeStamp + ".html";
  var strReportsFilePath  = strResultsFolderPath + "\\" + strReportName;
  
  
  var extentReports = JavaClasses.com_aventstack_extentreports.ExtentReports;
  var logStatus = JavaClasses.com_aventstack_extentreports.Status;
  
 
  var htmlReporter = JavaClasses.com_aventstack_extentreports_reporter.ExtentHtmlReporter.newInstance_2(strReportsFilePath);
  htmlReporter.config().setDocumentTitle("dPI Automation")
  htmlReporter.config().setReportName('dPI Automation')
  extent = extentReports.newInstance();
  var reportersArray = JavaClasses.java_lang_reflect.Array.newInstance_2(htmlReporter.getClass(), 1);
  reportersArray.$set("Items", 0, htmlReporter);
  extent.attachReporter(reportersArray);
  utilities.Extent = extent;
}




function SelectEnvironment()
{
  try{
    var myForm = UserForms.MyForm;
    var myRarioGroup = myForm.cxRadioGroup1;
    var envTest = myRarioGroup.Properties.Items.Add()
    envTest.Caption = "TEST Environment"
    var envQA = myRarioGroup.Properties.Items.Add()
    envQA.Caption = "QA Environment"
    var envProd = myRarioGroup.Properties.Items.Add()
    envProd.Caption = "PROD Environment"
    myForm.ShowModal();
    if (myForm.ModalResult != mrOk){
      Log.Message("Execution is cancelled by the user...");
      Runner.Stop();
    }
  }catch(exception){
    Log.Error("Exception", exception.description);
  }
}
  
function MyForm_cxRadioGroup1_OnChange(Sender)
{
  if (UserForms.MyForm.cxRadioGroup1.ItemIndex == 0){
    strTestEnv = "TEST";
    Log.Warning("Execution setup is not ready for TEST environment...")
    Runner.Stop();
  }else if (UserForms.MyForm.cxRadioGroup1.ItemIndex == 1){
    strTestEnv = "QA";
  }else if (UserForms.MyForm.cxRadioGroup1.ItemIndex == 2){
    strTestEnv = "PROD";
    Log.Warning("Execution setup is not ready for PROD environment...")
    Runner.Stop();
  }
  Log.Message("Execution Environment: " + strTestEnv);
  Project.Variables.TestEnvironment = strTestEnv;
}

function MyForm_cxButton1_OnClick(Sender)
{
  Log.Message("--- The execution of 'Mozart Application' starts in " + Project.Variables.TestEnvironment + " environment...");
}

function MyForm_cxButton2_OnClick(Sender)
{
  Log.Message("--- The execution of 'Mozart Application' is cancelled...");
}


function TestEnvironmentInfo()
{
    var host = Sys.HostName;
    var now = aqDateTime.Now();
    var date = aqConvert.DateTimeToFormatStr(now, "%m-%d-%Y");
    var time = aqConvert.DateTimeToFormatStr(now, "%H:%M:%S");

    Log.AppendFolder("Test Environment");

    Log.Message("Host: " + host);
    Log.Message("OS: " + Sys.OSInfo.FullName);

    if ( Sys.OSInfo.VMWare == true ){
      Log.Message("Running on a VMWare virtual machine.");
    }

    if ( Sys.OSInfo.VirtualPC == true ){
      Log.Message("Running on a VirtualPC virtual machine.");
    }

    Log.Message("Windows User: " + Sys.UserName); 

    if ( Sys.WaitProcess("TestComplete").Exists == true ){
      var tcmpprocess = Sys.WaitProcess("TestComplete");
      Log.Message("TestComplete Version: " + tcmpprocess.FileVersionInfo.MajorPart + "."
        + tcmpprocess.FileVersionInfo.MinorPart + "." + +tcmpprocess.FileVersionInfo.BuildPart);
    }else if ( Sys.WaitProcess("TestExecute").Exists == true ){
      var texecprocess = Sys.WaitProcess("TestExecute");
      Log.Message("TestExecute Version: " + texecprocess.FileVersionInfo.MajorPart + "."
        + texecprocess.FileVersionInfo.MinorPart + "." + +texecprocess.FileVersionInfo.BuildPart);
    }else{
      Log.Message("TestComplete\TestExecute Version Not Available.");
    }
    Log.Message("Execution Date: " + date);
    Log.Message("Execution Time: " + time);

    Log.PopLogFolder();
}

function GeneralEvents_OnLogError(Sender, LogParams)
{
  Runner.Stop();
}

function GeneralEvents_OnStopTest(Sender)
{
  var strProjectName = "dPIAutomation";
  var strPrjSuitePath           = ProjectSuite.Path
  var strPrjSuiteName           = ProjectSuite.FileName
  var strSuiteNameWithExt       = aqString.Replace(strPrjSuiteName, strPrjSuitePath, "");
  var strSuiteNameWithOutExt    = aqString.Replace(strSuiteNameWithExt, ".pjs", "");
  var strTestScriptsFolderPath  = aqString.Replace(strPrjSuitePath, strSuiteNameWithOutExt + "\\", "");
  var strResultsFolderPath = aqString.Replace(strTestScriptsFolderPath, "Test_Scripts\\", "Test_Results\\TestCompleteLogs\\");
  SaveLogs(strResultsFolderPath, strProjectName)
  
  utilities.Extent.flush();
}

