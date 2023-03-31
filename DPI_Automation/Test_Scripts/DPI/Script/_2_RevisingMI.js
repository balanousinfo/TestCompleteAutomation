//USEUNIT dpi
//USEUNIT utilities
//utilities.Test      =  utilities.Extent.createTest("Enovia Login Test");
//utilities.TestCase  = utilities.Test.createNode("Enovia Login TC");
  
var existingRevCount;
var sMaterialId = "20161558";

function RevisingMI()
{
  utilities.Test =  utilities.Extent.createTest("Revising an MI");
  TS1_RevisingMI_in_dPI()
  TS2_OneRevisonEditAtATime()
  TS3_AddNewOwner()
  TS4_RevisingMI_via_Enovia()
}


function TS4_RevisingMI_via_Enovia()
{
  CreateRevisionInEnovia();
  FetchRevisionFrom_Enovia_To_dPI();
   
}



function CreateRevisionInEnovia()
{
  try{
    fnTitle = "TS 4.1: Create New Revision In Enovia";
    utilities.TestCase = utilities.Test.createNode(fnTitle);
    Log.AppendFolder(fnTitle)
    objEnoviaPage = LogintoEnovia();
    SearchAndOpenRevision();
    CreateEnoviaRevision();
    AddNewChangeAction();
    UpdateReviseReason();
    var result = WaitUntilNewRevisionReflects();
    if(result){
      strMessage = "New MI Revision was successfully created in Enovia";
      LogCheckpoint(strMessage);
      utilities.TestCase.pass_2(strMessage);
    }else{
      strMessage = "New MI Revision was not created in Enovia";
      LogError(strMessage);
      utilities.TestCase.fail_2(strMessage);
    }
  }catch (e){
    strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestCase.fail_2(strMessage);
  }
  finally{
    Log.PopLogFolder();
  }
}


function FetchRevisionFrom_Enovia_To_dPI()
{
  try{
    fnTitle = "TS 4.2:Fetching Revision details in dPI from Enovia";
    utilities.TestCase = utilities.Test.createNode(fnTitle);
    Log.AppendFolder(fnTitle)
    var tPnGLogo    = xpath.pngLogo;
    var tSearchMITb = xpath.searchRepoTB
    var tMIName     = xpath.MINameTB;
    var tMIRevision = xpath.MIRevisionTB;
    var tFetchFromEnoviaBtn = xpath.fetchFromEnoviaBtn;
    var tSelectEnoviaEnvCmb = xpath.selectEnoviaEnvCmb;
    var tEnoviaEnvOKBtn = xpath.okEnoviaEnvBtn;
    var tEnoviaEnvPwdTB = xpath.enoviaEnvPwdTB;
    var tEnoviaLinkError = xpath.enoviaLinkErrorMsg;
    var tEnoviaLinkStatus = xpath.enoviaLinkStatusMsg;
    var tCloseWindowBtn = xpath.closeWindowBtn;
    var sSearchValue  = utilities.env_GCASNo;
    var sExpRevision  = utilities.env_NewRev;
    var sSearchType   = utilities.searchByGCASNo;
    var tAcceptEnoviaChangesBtn = "//button[text()='Accept Enovia Changes...']"
    
    var dpiUsername = utilities.authUsername;
    var dpiPassword = utilities.authPassword;
    
    dpi.LogintoDPI(dpiUsername, dpiPassword)
    
    ClickAndWaitCSS(tPnGLogo, tSearchMITb)  
    result = SearchMI(sSearchType, sSearchValue)
    tCurrRow = result.tCurrRow
    MIMoreInfoOperations(tCurrRow, "Copy MI")
  
    MI = SplitMIandRevision(sExpRevision)
    sName = MI.Name;
    sRevision = MI.Rev;
    EnterValueCSS(tMIName, sName)
    EnterValueCSS(tMIRevision, sRevision)
  
    ClickAndWaitCSS(tFetchFromEnoviaBtn, tSelectEnoviaEnvCmb)
  
    EnterValue_KeysCSS(tSelectEnoviaEnvCmb, "QA")
  
    ClickAndWaitCSS(tEnoviaEnvOKBtn, tEnoviaEnvPwdTB)
    EnterValue_KeysCSS(tEnoviaEnvPwdTB, utilities.authPassword)
    
    objAcceptEnoviaChanges = ClickAndWaitCSS(tEnoviaEnvOKBtn, tAcceptEnoviaChangesBtn)
    if (objAcceptEnoviaChanges.Visible){
      sMessage1 = GetPropertyValue("//div[@id='ctrln-products-enovia-status']/p[3]", "innerText")
      sMessage2 = GetPropertyValue("//div[@id='ctrln-products-enovia-status']/p[4]", "innerText")
      sMessage3 = GetPropertyValue("//div[@id='ctrln-products-enovia-status']/p[5]", "innerText")
      LogMessage(sMessage1)
      LogMessage(sMessage2)
      LogMessage(sMessage3)
      ClickButtonCSS(tAcceptEnoviaChangesBtn)
      aqUtils.Delay(5000)
      strMessage = "Newly created revision (via Enovia) was fetched successfully in dPI"
      utilities.TestCase.pass_2(strMessage);
      LogCheckpoint(strMessage)
    }else{
      strMessage = "Newly created revision (via Enovia) was not fetched in dPI"
      utilities.TestCase.fail_2(strMessage);
      LogError(strMessage)
    }
  }catch (e){
    strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestCase.fail_2(strMessage);
  }
  finally{
    Log.PopLogFolder();
  }
  
}


function SearchAndOpenRevision()
{
  try{
    var fnTitle = "Search and Open Revision";
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle);
    
    sMaterialId = "20161558"
    objEnoviaPage= Sys.Browser("edge").Page("https://plmqa.pg.com/enovia*")
  
    // Searching the revision which isin 'Release' state
    tGCASSearchText = "//input[@placeholder='Search']"
    tGCASSearchBtn = "//div[@data-rec-id='run_btn_search']"
    tGCASContainer ="//div[@class='wux-layouts-left-poolcontainer']"
    tFirstRow = `//div[@class='wux-controls-abstract wux-layouts-collectionview-cell wux-layouts-datagridview-cell']//span[text()='${sMaterialId}']/..//span[@class='fonticon fonticon-2x fonticon-down-open']`
    tOpenRecordBtn  = "//li[@id='action_DisplayDetails']/span[text()='Open']"
  
    EnterValue_KeysCSS(tGCASSearchText, sMaterialId, objEnoviaPage)
  
    ClickAndWaitCSS(tGCASSearchBtn, tGCASContainer, objEnoviaPage)
    aqUtils.Delay(5000)
    existingRevCount = GetPropertyValue(tGCASContainer, "childElementCount", objEnoviaPage)

    ClickAndWaitCSS(tFirstRow, tOpenRecordBtn, objEnoviaPage)
  
    ClickButtonCSS(tOpenRecordBtn, objEnoviaPage)
    aqUtils.Delay(5000)
    strMessage = "MI '" + sMaterialId + "' was successfully opened."
    LogCheckpoint(strMessage)
    utilities.TestStep.pass_2(strMessage);
  }catch (e){
    strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestStep.fail_2(strMessage);
  }
  finally{
    Log.PopLogFolder();
  }
}

function CreateEnoviaRevision()
{
  try{
    var fnTitle = "Create Enovia Revision";
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle);
    objIFrame_1     = getIframeObject('pgVPDSectionAttributes')
    tRevisionLabel  = "//tr[@id='calc_Revision']/td[2]"
    oldRevision = GetPropertyValue(tRevisionLabel, "contentText", objIFrame_1)
    LogMessage("Old Revision : " + oldRevision)
  
    objIframeMain = getIframeObject('detailsDisplay')   

    tRevisionBtn = "//td[@id='CPNProductDataRevise']"
    ClickButtonCSS(tRevisionBtn, objIframeMain)
    aqUtils.Delay(5000)
    objDialog=Sys.Browser("edge").Page("https://plmqa.pg.com/enovia/common/emxNavigatorDialog.jsp")
  
    if(objDialog.Exists && objDialog.VisibleOnScreen){
      title_desc = "DPI integration automation test"
      iframeP_xpath="//iframe[@id='content']"
      iframe=objDialog.FindElement(iframeP_xpath)

      title_xpath="//input[@id='Title']"
      EnterValueCSS(title_xpath, title_desc, iframe)
    
      description_xpath="//textarea[@id='Description']"
      EnterValue_KeysCSS(description_xpath, title_desc, iframe)

      tDoneBtn = "//button[@class='btn-primary' and text()='Done']"
      ClickButtonCSS(tDoneBtn, iframe)
      aqUtils.Delay(10000)
      objIFrame_1     = getIframeObject('pgVPDSectionAttributes')
      revisionText_xpath="//tr[@id='calc_Revision']/td[2]"
      newRevision = GetPropertyValue(tRevisionLabel, "contentText", objIFrame_1)
      LogMessage("New Revision : " + oldRevision)
      if(newRevision > oldRevision){
        strMessage = `Revison is changed. old revision was ${oldRevision} and new revision is ${newRevision}`
        LogCheckpoint(strMessage)
        utilities.TestStep.pass_2(strMessage);
      }else{
        strMessage = `Revison number was not matching. old revision was ${oldRevision} and new revision is ${newRevision}`
        LogError(strMessage)
        utilities.TestStep.fail_2(strMessage);
      }
    }else{
      strMessage = "Revise dialog was not found."
      LogError(strMessage)
      utilities.TestStep.fail_2(strMessage);
    }
  }catch (e){
    strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestStep.fail_2(strMessage);
  }
  finally{
    Log.PopLogFolder();
  }
}


function AddNewChangeAction()
{
  try{
    var fnTitle = "Add New Change Action";
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle);
    objEnoviaPage= Sys.Browser("edge").Page("https://plmqa.pg.com/enovia*")
  
    tChangeMgmtBtn = "//li[@name='li_ECMChangeManagement']";
    ClickButtonCSS(tChangeMgmtBtn, objEnoviaPage)
    aqUtils.Delay(5000)
    objIFrame_1=getIframeObject('ECMCAs') 
  
    tAddNewCA="//td[@id='ECMAddToNewCA']"
    ClickButtonCSS(tAddNewCA, objIFrame_1)
  
    objFrame2 = FindElementCSS("//iframe[@name='slideInFrame']", objEnoviaPage)
    if(objFrame2.Exists){
      title_desc="DPI integration automation test ca"

      title_xpath="//input[@title='Title']"
      EnterValueCSS(title_xpath, title_desc, objFrame2)
  
      description_xpath="//textarea[@id='DescriptionId']"
      EnterValue_KeysCSS(description_xpath, title_desc, objFrame2)
    
      tDoneBtn = "//button[@class='btn-primary' and text()='OK']"
      ClickButtonCSS(tDoneBtn, objFrame2)
      aqUtils.Delay(5000)
      strMessage = "New Change Action was successfully added."
      LogCheckpoint(strMessage)
      utilities.TestStep.pass_2(strMessage);
    }else{
      strMessage = "New Change Action was not added."
      LogError(strMessage)
      utilities.TestStep.fail_2(strMessage);
    }
  }catch (e){
    strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestStep.fail_2(strMessage);
  }
  finally{
    Log.PopLogFolder();
  }
}


function UpdateReviseReason()
{
  try{
    var fnTitle = "Update Revise Reason";
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle);
    
    objEnoviaPage= Sys.Browser("edge").Page("https://plmqa.pg.com/enovia*")
    reason = "Test Automation Demo"
    reviseTab_xpath="//div[@id='catMenu']//li[@name='li_type_pgMakingInstructions']"
    ClickButtonCSS(reviseTab_xpath, objEnoviaPage)
    aqUtils.Delay(5000)
    objIFrame_1 = getIframeObject('pgVPDSectionAttributes') //################################################
  
    tEditReasonBtn="//td[@id='pgVPDSectionAttributeEditAll']"
    ClickButtonCSS(tEditReasonBtn, objIFrame_1)

    tEditReasonTxt = "//input[@id='Reason For change']"
    EnterValueCSS(tEditReasonTxt, reason, objIFrame_1)

    tDoneBtn = "//button[@class='btn-primary' and text()='Done']"
    ClickButtonCSS(tDoneBtn, objIFrame_1)  
    aqUtils.Delay(5000)
    strMessage = "Revise reason '" + reason + "' was successfully updated."
    LogCheckpoint(strMessage)
    utilities.TestStep.pass_2(strMessage);
  }catch (e){
    strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestStep.fail_2(strMessage);
  }
  finally{
    Log.PopLogFolder();
  }
}

function WaitUntilNewRevisionReflects()
{
  try{
    var fnTitle = "Wait Until New Revision Reflects";
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle);
    
    revisionCreated= false;
    existingRevCount= 1 //####################################################
    objEnoviaPage= Sys.Browser("edge").Page("https://plmqa.pg.com/enovia*")
  
    tGCASSearchText = "//input[@placeholder='Search']"
    tGCASSearchBtn = "//div[@data-rec-id='run_btn_search']"
    tGCASContainer ="//div[@class='wux-layouts-left-poolcontainer']"
  
  
    tHomePageIcon="//div[@id='divExtendedHeaderNavigation']//button[@class='home']"
    ClickButtonCSS(tHomePageIcon, objEnoviaPage) 
    aqUtils.Delay(3000)

  
    for (var i=0; i <= 50;i++){
      EnterValue_KeysCSS(tGCASSearchText, sMaterialId, objEnoviaPage)
      ClickButtonCSS(tGCASSearchBtn, objEnoviaPage)
      aqUtils.Delay(3000)
      objExp=FindElementCSS(tGCASContainer, objEnoviaPage)
      updatedRevCount = objExp.childElementCount
      Log.Message("Updated Child Count = "+ updatedRevCount)
      if (updatedRevCount == (existingRevCount + 1)){
        revisionCreated= true;
        break;
      }else{
        aqUtils.Delay(3000)
      }
    }
    if (revisionCreated){
      strMessage = "New revision has been Successfully created."
      LogCheckpoint(strMessage)
      utilities.TestStep.pass_2(strMessage);
    }else{
      strMessage = "New revision was not successfully created."
      LogError(strMessage);
      utilities.TestStep.fail_2(strMessage);
    }
  }catch (e){
    strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestStep.fail_2(strMessage);
  }
  finally{
    Log.PopLogFolder();
  }
  return revisionCreated;
}




function TS1_RevisingMI_in_dPI()
{
  try{
    var fnTitle = "TS 1: Revising MI";
    utilities.TestCase = utilities.Test.createNode(fnTitle);
    Log.AppendFolder(fnTitle)
    var tPnGLogo      = xpath.pngLogo;
    var tSearchMITb   = xpath.searchRepoTB;
    var tCheckinBtn   = xpath.checkinBtn;
    var sSearchValue  = utilities.rev_GCASNo;
    var sSearchType   = utilities.searchByGCASNo;

    ClickAndWaitCSS(tPnGLogo, tSearchMITb)  
    result = SearchMI(sSearchType, sSearchValue)  
    tCurrentRecord = result.tCurrRow
    MIMoreInfoOperations(tCurrentRecord, "Revise MI")
    ClickButtonCSS(tCheckinBtn)
  }catch (e){
    strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestCase.fail_2(strMessage);
  }
  finally{
    Log.PopLogFolder();
  }
}

function TS2_OneRevisonEditAtATime()
{
  try{
    fnTitle = "TS 2: Only one revision at a time";
    utilities.TestCase = utilities.Test.createNode(fnTitle);
    Log.AppendFolder(fnTitle)
    var tPnGLogo    = xpath.pngLogo;
    var tSearchMITb = xpath.searchRepoTB
    var tMIName     = xpath.MINameTB;
    var tMIRevision = xpath.MIRevisionTB;
    var tFetchFromEnoviaBtn = xpath.fetchFromEnoviaBtn;
    var tSelectEnoviaEnvCmb = xpath.selectEnoviaEnvCmb;
    var tEnoviaEnvOKBtn = xpath.okEnoviaEnvBtn;
    var tEnoviaEnvPwdTB = xpath.enoviaEnvPwdTB;
    var tEnoviaLinkError = xpath.enoviaLinkErrorMsg;
    var tEnoviaLinkStatus = xpath.enoviaLinkStatusMsg;
    var tCloseWindowBtn = xpath.closeWindowBtn;
    var sSearchValue = utilities.rev_NewRev;
    var sSearchType = utilities.searchByGCASNo;
    ClickAndWaitCSS(tPnGLogo, tSearchMITb)  
    result = SearchMI(sSearchType, sSearchValue)
    tCurrRow = result.tCurrRow
    MIMoreInfoOperations(tCurrRow, "Copy MI")
  
    MI = SplitMIandRevision(sSearchValue)
    Name = MI.Name;
    Revision = MI.Rev;
    EnterValueCSS(tMIName, Name)
    EnterValueCSS(tMIRevision, Revision)
  
    ClickAndWaitCSS(tFetchFromEnoviaBtn, tSelectEnoviaEnvCmb)
  
    EnterValue_KeysCSS(tSelectEnoviaEnvCmb, "QA")
  
    ClickAndWaitCSS(tEnoviaEnvOKBtn, tEnoviaEnvPwdTB)
    EnterValue_KeysCSS(tEnoviaEnvPwdTB, utilities.authPassword)
    ClickAndWaitCSS(tEnoviaEnvOKBtn, tEnoviaLinkError)
    sEnoviaLinkStatus = GetPropertyValue(tEnoviaLinkStatus, "innerText")
    LogCheckpoint("Expected error message displayed.")
    LogCheckpoint(sEnoviaLinkStatus)
    ClickButtonCSS(tCloseWindowBtn)
  }catch (e){
    strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestCase.fail_2(strMessage);
  }
  finally{
    Log.PopLogFolder();
  }
}


function TS3_AddNewOwner()
{
  try{
    ownername = "m.bm.1"
    fnTitle = "TS 3: Add New co-owner [" + ownername + "] and verify edit";
    utilities.TestCase = utilities.Test.createNode(fnTitle);
    Log.AppendFolder(fnTitle)
    var tPnGLogo      = xpath.pngLogo;
    var tSearchMITb   = xpath.searchRepoTB;
    var tCheckoutBtn  = xpath.checkoutBtn;
    var sSearchValue = utilities.rev_NewRev;
    var sSearchType = utilities.searchByGCASNo;
    
    ClickAndWaitCSS(tPnGLogo, tSearchMITb)  
    result = SearchMI(sSearchType, sSearchValue)
    tCurrRow = result.tCurrRow
    MIMoreInfoOperations(tCurrRow, "View MI")
    AddMIOwner(ownername)
    
    // loginto DPI with new owner
    LogintoDPI(utilities.owner1_username, utilities.owner1_password)
    result = SearchMI(sSearchType, sSearchValue)
    tCurrentRecord = result.tCurrRow
    MIMoreInfoOperations(tCurrentRecord, "View MI")
    objExp = FindElementCSS(tCheckoutBtn)
    if (objExp.Visible){
      LogCheckpoint("Newly added user is able to edit the MI when it was checked-in by other user.")
    }
  }catch (e){
    strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestCase.fail_2(strMessage);
  }
  finally{
    Log.PopLogFolder();
  }
}


function LogintoEnovia()
{
  try{
    var objEnoviaPage;
    enoviaUsername = "dsotest41.im"
    enoviaPassword = "Autumn_2022x"
    var fnTitle = "Login to Enovia Application [" + enoviaUsername + "]";
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle);
    sBrowser  = "edge";
    sAppURL   = "https://plmqa.pg.com/enovia";
    
    tUserNameTb = "//input[@id='username']";
    tPasswordTb = "//input[@id='password']";
    tSignOnBtn  = "//button[@id='loginButton']";
    tHomePage   = "//form[@id='loginForm']";
    tCredokBtn  ="//button[@id='submitButton']";
    objEnoviaPage = RunBrowserInPrivateMode(sBrowser, sAppURL);
  
    EnterValue_KeysCSS(tUserNameTb, enoviaUsername, objEnoviaPage);
    EnterValue_KeysCSS(tPasswordTb, enoviaPassword, objEnoviaPage);
    objExp = ClickAndWaitCSS(tSignOnBtn, tHomePage, objEnoviaPage);
    if (objExp.Visible){
      ClickButtonCSS(tCredokBtn, objEnoviaPage)
      strMessage = "Login to dPI was successful [" + enoviaUsername+ "]"
      LogCheckpoint(strMessage)
      utilities.TestStep.pass_2(strMessage);
    }else{
      strMessage = "Login to dPI was not successful [" + enoviaUsername+ "]"
      LogError(strMessage)
      utilities.TestStep.fail_2(strMessage);
    }
    aqUtils.Delay(3000)
  }catch (e){
    strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestStep.fail_2(strMessage);
  }
  finally{
    Log.PopLogFolder();
  }
  return objEnoviaPage;
}




function fnAdvanceSearch(addReleaseFlag, objEnoviaPage){
  aqUtils.Delay(3000)
  tSearchdropdown="//div[@id='searchFieldDropdown']"
  tAdvanceSearch="//li[@class='item secondaryMenuAdvanced']"
  ClickButtonCSS(tSearchdropdown, objEnoviaPage) 
  ClickButtonCSS(tAdvanceSearch,  objEnoviaPage) 
  typeOption ="Making Instruction"
  tTypeOption="//span[text()='"+typeOption+"']"
  tTypeComboBx="//input[@placeholder='Select a type (optional)']"
  EnterValueCSS(tTypeComboBx, typeOption, objEnoviaPage)
  
  sMaterialId = "20161032"
  tName="//div[@title='Name']/following-sibling::div//input"
  EnterValueCSS(tName, sMaterialId, objEnoviaPage)
  
  tSeeMoreLink="//div[contains(string(), 'More Criteria') and @class='criteria-toggle']"
  ObjSeeMoreLink=FindElementCSS(tSeeMoreLink, objEnoviaPage)
  ObjSeeMoreLink.Click()
  
  tMaturityStatus="//div[@title='Maturity State']/following-sibling::div//input"
  EnterValueCSS(tMaturityStatus, "Release", objEnoviaPage)
  
  if(addReleaseFlag){
      tRevision = "//div[@title='Minor Revision']/following-sibling::div//input"
      EnterValueCSS(tRevision, newMIRevisonID,  objEnoviaPage)
  }
  
  tSearchBtn="//button[@class='btn-primary search-button btn btn-root']"
  ClickButtonCSS(tSearchBtn, objEnoviaPage)  
  aqUtils.Delay(3000)
}

