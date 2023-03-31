//USEUNIT common
//USEUNIT commonCSS
//USEUNIT xpath

function CreateMIPartFromEnovia(){
  try{
    var fnTitle = "Create a copy of MI "+utilities.gcas_2+" in Enovia";
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle)
    fnLoginPLM()
    searchMI()
    clickCopybutton()
    editCopydata()
  }catch (e){
    strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestStep.fail_2(strMessage);
  }finally{
    Log.PopLogFolder();
  }
}
 

function fnLoginPLM(){
  
  var objTxtUserNameEnovia = "#username"
  var objTxtPasswordEnovia = "#password"
  var objBtnLogineEnovia = "#loginButton"
  try{
    fnTitle = "Login into Enovia site";
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle)
    
      sAppURL=utilities.LoginData.EnoviaURL;//"https://plmqa.pg.com/enovia"
      RunBrowserInPrivateMode("chrome", sAppURL);
      var dpiUsername = utilities.authUsername;
      var dpiPassword = utilities.authPassword;
      
      EnterValueCSS(objTxtUserNameEnovia, dpiUsername)
      objPassword = FindElementCSS(objTxtPasswordEnovia)
      objPassword.Keys (dpiPassword)
      ClickButtonCSS(objBtnLogineEnovia)
      var objBtnOk = "#submitButton"
      objbtnPLMCredentialsOk = FindElementCSS(objBtnOk)
      //Validating Login Success
      if(objbtnPLMCredentialsOk.Visible == true ){   //|| objPLMHomePlusSign.Visible == true) {
        objbtnPLMCredentialsOk.Click()
        LogCheckpoint("Successfully logged in")
        utilities.TestStep.pass_2("Successfully logged in");
      }
  }catch(e){
     strMessage = fnTitle + " was failed: " + e.message
      LogError(strMessage);
      utilities.TestStep.fail_2(strMessage);
   }finally{
    Log.PopLogFolder();
  }
}
 
function searchMI(){
  materialId=utilities.gcas_2;
  try{
    fnTitle = "Searching MI "+materialId;
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle)
    fnSelctAdvanceSearchOption()
    
    fnFilterForAdvanceSearch(materialId)
    fnSelectSearchTableRow(materialId)
    LogCheckpoint("Successfully Navigated to Detail page "+materialId)
    utilities.TestStep.pass_2("Successfully Navigated to Detail page "+materialId);
   }catch(e){
   strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestStep.fail_2(strMessage);
   }finally{
    Log.PopLogFolder();
  }
}
  
function fnSelctAdvanceSearchOption(){
  
  retryCount=0;
  aqUtils.Delay(300)
  searchBoxDrpdown_xpath="//div[@id='searchFieldDropdown']"
  WaitForObjectCSS(searchBoxDrpdown_xpath)
  searchBoxDrpdownOption_xpath="//li[@class='item secondaryMenuAdvanced']"
  objSearchBoxDropDown=FindElementCSS(searchBoxDrpdown_xpath)
  while (retryCount<4){
    
    if (objSearchBoxDropDown.Exists){
      objSearchBoxDropDown.Click();
      aqUtils.Delay(1000,"waiting for advance search option")
      objOption=FindElementCSS(searchBoxDrpdownOption_xpath)
      
      if(objOption.Exists){
        objOption.Click()
      }else{
        Log.Error("Advance Search Option was not found")
      }
      
      break
    }else{
      aqUtils.Delay(1000,'waiting for search box drop down object')
      retryCount+=1;
    }
  }
}


function fnFilterForAdvanceSearch(materialId){
  try{
    //Part Type
    aqUtils.Delay(3000)   
    strType ="Making Instruction";
    fnSelectType(strType)
    fnEnterName(materialId)
    fnClickSeeMoreLink()
    maturityStatus="Release";
    fnEnterMaturityStatus(maturityStatus)
    fnClickSearchButton()
 }catch (e){ 
  Log.Error(e+" Gettign error while doing advance search...!!!")
 }
}
 
function fnSelectType(typeOption){
  
 for(i=0;i<10;i++) {
    //typeOption ="Formulation Part"
    option_Xpath="//span[text()='"+typeOption+"']"
    type_xPath="//input[@placeholder='Select a type (optional)']"
    WaitForObjectCSS(type_xPath)
    objPartType = FindElementCSS(type_xPath)
    if(objPartType.Exists){
      objPartType.Click();
      objPartType.Keys(typeOption)
      objPartTypeOption = FindElementCSS(option_Xpath)
      objPartTypeOption.Click();
      break;
    }else{
      i+=1;
      aqUtils.Delay(1000)
    }
  
  }
}


function fnClickSearchButton(){
  
  searchBtn_xpath="//button[@class='btn-primary search-button btn btn-root']"
  objSearchBtn = FindElementCSS(searchBtn_xpath)
  if(objSearchBtn.Exists && objSearchBtn.Enabled){
    objSearchBtn.Click()
    Log.Message("Search button was clicked.")
  }else {
    Sys.Keys("[Tab]")
    objSearchBtn.Click()
  }
  aqUtils.Delay(1000)  
}

function fnEnterName(materialId){
  retryCount=0
  while (retryCount < 5){
    name_xpath="//div[@title='Name']/following-sibling::div//input"
    objNameTextBox = FindElementCSS(name_xpath)
    if(objNameTextBox.Exists){
      objNameTextBox.Click();
       
      objNameTextBox.Keys(materialId)
      Sys.Keys("[Tab]") 
      aqUtils.Delay(500)
      break;
    }
    if(aqString.Find(objNameTextBox.contentText,materialId,0,false)!=-1){
      break;
    }else{
      retryCount+=1;
      aqUtils.Delay(1000)
    }
    
  } 
  Sys.Keys("[Tab]")
}

function fnClickSeeMoreLink(){
  try{
    seeMore_xpath="//div[contains(string(), 'More Criteria') and @class='criteria-toggle']"
    objSeeMore = FindElementCSS(seeMore_xpath)
    if(objSeeMore.Exists){
      objSeeMore.Click();
    
    }
  }catch(e){
    Log.Message("Its already showing all fields...")
  }
  
  aqUtils.Delay(1000)
}
 
function fnEnterMaturityStatus(maturityStatus){
   
    maturityStatus_xpath="//div[@title='Maturity State']/following-sibling::div//input"
    objMaturityStatus=FindElementCSS(maturityStatus_xpath)
  
    if(objMaturityStatus.Exists){
      objMaturityStatus.Click();
      aqUtils.Delay(100)
      objMaturityStatus.SetText(maturityStatus)
      aqUtils.Delay(1000)
    }else{
      EnterValue(maturityStatus_xpath,maturityStatus)
    }
    
}

function fnSelectSearchTableRow(materialID){
  aqUtils.Delay(3000,"waiting for table window")
  row_xpath=`//div[@class='wux-controls-abstract wux-layouts-collectionview-cell wux-layouts-datagridview-cell']//span[text()='${materialID}']/..//span[@class='fonticon fonticon-2x fonticon-down-open']`
  objTableRow=FindElementCSS(row_xpath)
  if (objTableRow.Exists){
    objTableRow.Click()
    aqUtils.Delay(2000,"waiting for pop up window")
    
    open_xpath="//li[@id='action_DisplayDetails']/span[text()='Open']"
    objOpen=FindElementCSS(open_xpath)
    objOpen.Click()
    Log.Message("Selected table data")
     
  }else{
    Log.Message("Table data was not selected..!!!")
  }

}
 

function fnGetMainIframe(){
  iframeP_xpath="//iframe[@id='content']"
  objIframeMain=FindElementCSS(iframeP_xpath)
  iFrameC_xpath="//iframe[@name='detailsDisplay']"
  objIframe=objIframeMain.FindElement(iFrameC_xpath)
  return objIframe
}
 

function clickCopybutton(){
  retry=3
  for(i=0;i<retry;i++){
    aqUtils.Delay(10000,"Loading details")
    mainframe=getIframeObject('detailsDisplay')
    copyIcon_xpath="//div[@id='divToolbar']//td[@id='ENCPartClone']" 
    objCloneIcon=mainframe.FindElement(copyIcon_xpath)
    if (objCloneIcon.Exists){
      ClickButton(objCloneIcon)
      break;
    }else{
      aqUtils.Delay(1000)
    }
  }   

}

function editCopydata(){
  title_desc="Nous DPI testing ta1";
  changeTemplate="Fast Track"
  status="Permanent"
  try{
    fnTitle = "Copying the MI ";
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle)

    iframe_xpath="//iframe[@name='slideInFrame']"
    objIframe=FindElementCSS(iframe_xpath)
    title_xpath="//input[@id='Title']"
    objTitletxtBx=objIframe.FindElement(title_xpath)
    objTitletxtBx.SetText(title_desc)
  
    description_xpath="//textarea[@id='DescriptionId']"
    objDesctxtBx=objIframe.FindElement(description_xpath)
    objDesctxtBx.Keys("^a"+title_desc)
  
    
    addSearchChangeTemplate()
    aqUtils.Delay(3000,"waiting for status object")
    status_xpath="//select[@id='statusId']"
    option_xpath=`//option[text()='${status}']`
    objstatus=objIframe.FindElement(status_xpath)
    objstatus.Click()
    
    aqUtils.Delay(1000,"checking option")
    if(status=="Permanent"){
      objstatus.Keys("Permanent")
      //objstatus.ClickItem(1)
    }else if(status=="Temporary"){
      objstatus.ClickItem(0)
    }
    
    aqUtils.Delay(1000,"checking option")
    
     
    okBtn_xpath="//button[@class='btn-primary' and text()='OK']"
    tMIHeader=`//div[@id='divExtendedHeaderName']//span[text()='${title_desc}']`
    objIframeMain=getIframeObject('slideInFrame')   
    objOkBtn=objIframeMain.FindElement(okBtn_xpath);
    objOkBtn.Click()
    aqUtils.Delay(10000,"submitting values...") 
    WaitForObjectCSS(tMIHeader)  
    objMiHeader=FindElementCSS(tMIHeader)
  
    
    if(objMiHeader.Exists && (objMiHeader.VisibleOnScreen || objMiHeader.Visible)){
      
      tNewMI="//li[@class='menu text-only active' and @name='li_type_pgMakingInstructions']"
      objNewMi=FindElementCSS(tNewMI)
      
      strMessage = "Successfully created new MI data "+objNewMi.contentText
      LogCheckpoint(strMessage)
      utilities.TestStep.pass_2(strMessage);
      
      Variables = Project.Variables;
      VarName = "NewMiNo";

      if (!Variables.VariableExists(VarName)){
        Project.Variables.AddVariable("NewMiNo", "String");
      }
      Project.Variables.NewMiNo = objNewMi.contentText
      
      Sys.Browser("chrome").Page("*").Close()
  
    }else{
      LogError("Error occured while editing the product info ...!!!")
    }
  }catch(e){
     strMessage = fnTitle + " was failed: " + e.message
      LogError(strMessage);
      utilities.TestStep.fail_2(strMessage);
   }finally{
    Log.PopLogFolder();
  }
}


function addSearchChangeTemplate(){
    
  changeTemplateFlag=true;
  objIframeMain=getIframeObject('slideInFrame')   
  try{
     
      changeTempIcon_xpath="//input[@name='btnChangeTemplate']"
      objchangeTemp=objIframeMain.FindElement(changeTempIcon_xpath);
      objchangeTemp.Click()
  
      name="Fast track"
      fnEnterName(name)
       
      fnClickSearchButton()
  
      objRowdata=FindElementCSS("//span[text()='Fast track' and @data-rec-id]")
      objRowdata.Click();
      objPopUp=Sys.Browser("chrome").Page("https://plmqa.pg.com/enovia/common/emxNavigatorDialog.jsp*")
      objPopUp.Close()
      aqUtils.Delay(1000)
      okBtn_xpath="//button[@id='id_in_app_ok']"
      objOkBtn = FindElementCSS(okBtn_xpath)
      if(objOkBtn.Exists && objOkBtn.Enabled){
        objOkBtn.Click()
      } 
      
  }catch(e){
    Log.Message("Getting error while selecting chage template")
  }
}
 


function getIframeObject(iframeName){
  var iframe;
  page=Sys.Browser("chrome").Page("*")
  switch (iframeName){
    case "content":
      iframeP_xpath="//iframe[@id='content']"
      iframe=page.FindElement(iframeP_xpath)
      break
    case "detailsDisplay":
      iframeP_xpath="//iframe[@id='content']"
      objIframeMain=page.FindElement(iframeP_xpath)
      iFrameC_xpath="//iframe[@name='detailsDisplay']"
      iframe=objIframeMain.FindElement(iFrameC_xpath)
      break;
    case "portalDisplay":
      iframeP_xpath="//iframe[@id='content']"
      objIframeMain=page.FindElement(iframeP_xpath)
      iFrameC_xpath="//iframe[@name='detailsDisplay']"
      mainFrame=objIframeMain.FindElement(iFrameC_xpath)
      iframeP_xpath="//iframe[@name='portalDisplay']"
      iframe=mainFrame.FindElement(iframeP_xpath)
      break;
    case "pgVPDSectionAttributes":
      iframeP_xpath="//iframe[@id='content']"
      objIframeMain=page.FindElement(iframeP_xpath)
      iFrameC_xpath="//iframe[@name='detailsDisplay']"
      mainFrame=objIframeMain.FindElement(iFrameC_xpath)
      iframeP_xpath="//iframe[@name='portalDisplay']"
      iframec1=mainFrame.FindElement(iframeP_xpath)
      
      iframec2_xpath="//iframe[@name='pgVPDSectionAttributes']"
      iframe=iframec1.FindElement(iframec2_xpath)
      
      break;
        
    case "pgDSMRouteTemplates":
      iframeP_xpath="//iframe[@id='content']"
      objIframeMain=page.FindElement(iframeP_xpath)
      iFrameC_xpath="//iframe[@name='detailsDisplay']"
      mainFrame=objIframeMain.FindElement(iFrameC_xpath)
      iframeP_xpath="//iframe[@name='portalDisplay']"
      iframeportal=mainFrame.FindElement(iframeP_xpath)
      
      iframeP_xpath="//iframe[@name='pgDSMRouteTemplates']"
      iframe=iframeportal.FindElement(iframeP_xpath)
      break;
    case "slideInFrame":
      iframe_xpath="//iframe[@name='slideInFrame']"
      iframe=page.FindElement(iframe_xpath)
      break;
    case 'ECMCAs':
      iframeP_xpath="//iframe[@id='content']"
      objIframeMain=page.FindElement(iframeP_xpath)
      iFrameC_xpath="//iframe[@name='detailsDisplay']"
      mainFrame=objIframeMain.FindElement(iFrameC_xpath)
      iframec1_xpath="//iframe[@name='portalDisplay']"
      childFrame=mainFrame.FindElement(iframec1_xpath) 
      iframec2_xpath="//iframe[@name='ECMCAs']"
      iframe=childFrame.FindElement(iframec2_xpath)   
      }
   return iframe;
}

