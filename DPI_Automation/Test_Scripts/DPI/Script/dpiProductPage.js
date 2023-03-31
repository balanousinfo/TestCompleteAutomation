//USEUNIT common
//USEUNIT commonCSS
//USEUNIT xpath
 
 
//Visibility of Downloaded Enovia Parts
function ViewTheProductPart(){
  try{
     
    fnTitle = "Viw Poduct Part  ";
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle)
    columnName="name"
    SelectQuickTabIcons("Products")
    tViewPrdBtn="//button[@id='ctrln-products-mode-0']"
    tTableNameCol=`//div[@role='rowgroup' and @ref='eCenterContainer' ]//div[@col-id='${columnName}']//span[@class='ag-group-value']`
    ClickAndWaitCSS(tViewPrdBtn,tTableNameCol)
    
   // tTableNameCol=xpath.tTableNameCol
    childObjects=FindElementsCSS(tTableNameCol)
    if(childObjects.length>0){
      productName=childObjects[0].contentText
      utilities.TestStep.pass_2(productName+" expanded for displaying"); 
      columnIconXpath=`(//div[contains(@class,'ag-header-') and @col-id='${columnName}']//span[@class='ag-icon ag-icon-menu'])[2]`
  
      sFilterValue= FilerSelectedTableColumn(columnIconXpath,columnName,productName)
      if (sFilterValue){
        tExpandIcon="//div[@role='row']//span[@class='ag-icon ag-icon-tree-closed']"
        ClickButtonCSS(tExpandIcon)
        tExtendPrdName="//div[@role='gridcell' and @col-id='material_name']"
        objProductList=FindElementsCSS(tExtendPrdName)
        for(i=0;i<objProductList.length;i++){
          objProductList[i].HoverMouse()
        }
        utilities.TestStep.pass_2("Products are displaying");
      }else{
        LogError("Filter Icon was disabled")
        utilities.TestStep.fail_2("Filter Icon was disabled")
      }
    }else{
      Log.Warning("There is no data in table")
      
    }
  }catch(e){
    strMessage = "Expected product was not found."
    LogError(strMessage)
    utilities.TestStep.fail_2(strMessage)
  }finally{
    Log.PopLogFolder();
  }
}

function test(){
  columnName="name"
  columnIconXpath=`(//div[contains(@class,'ag-header-') and @col-id='${columnName}']//span[@class='ag-icon ag-icon-menu'])[2]`
  
  FilerSelectedTableColumn(columnIconXpath,columnName,"90068595 (003)")
}
//parameter columnName is html @col-id tag
//filterValue="90064084"
//  columnName="name"
function FilerSelectedTableColumn(columnIconXpath,columnName,filterValue){
 try{ 
    fnTitle = "Filtering Column in table";
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle)  
    
    //tColumnHeaderSearchIcon=`//div[contains(@class,'ag-header-') and @col-id='${columnName}']//span[@class='ag-icon ag-icon-menu']`
    objSearchIcon=FindElementCSS(columnIconXpath)
   // Sys.HighlightObject(objSearchIcon)
   if(objSearchIcon.Exists){
    objSearchIcon.Click()
    retry=10
    var displayColName;
    var enabledFilter=false;
    for (i=1;i<=retry;i++ ){
      aqUtils.Delay(200) 
      tColConfigIcon="//div[contains(@class,'ag-popup-child')]//div[@ref='eHeader']//span[@class='ag-icon ag-icon-columns']" 
      objColConfigIcon=FindElementCSS(tColConfigIcon)
   
      if(objColConfigIcon.Exists){
        objColConfigIcon.Click()
        tSearchPopup="//div[contains(@class,'ag-popup-child')]//div[@ref='eHeader']//span[@class='ag-icon ag-icon-filter']" 
   
        objFilterIcon=FindElementCSS(tSearchPopup)
        objFilterIcon.Click()
        
        aqUtils.Delay(2000) 
        if (columnName=="name"){
          displayColName="Name "
          tInputText="//div[contains(@class,'ag-popup-child')]//input" 
          ObjTextBox=FindElementCSS(tInputText)
          ObjTextBox.Keys(filterValue)
          Sys.Keys("[Enter]")
          enabledFilter=true
          aqUtils.Delay(3000,"closing pop up")
        }else if(aqString.Find(columnName,"filter_",0,false)!=-1){
          displayColName="BP Group"
          tInputText="//div[contains(@class,'ag-popup-child')]//input" 
          ObjTextBox=FindElementCSS(tInputText)
          ObjTextBox.Keys(filterValue)
          Sys.Keys("[Enter]")
          enabledFilter=true;
          aqUtils.Delay(2000,"closing pop up")
        }else if (columnName=="min_target_max"){  
          displayColName="Target"
          tUnselect="//div[@class='ag-filter']//label[@ref='eSelectAllContainer']" 
          ClickButtonCSS(tUnselect)
          tSelectFil=`//div[@class='ag-filter']//span[text()='${filterValue}']`
          ClickButtonCSS(tSelectFil)
          enabledFilter=true
        }  
        objFilterIcon.Click()
        strMessage = displayColName+" column filtered with "+filterValue
        LogCheckpoint(strMessage)
        utilities.TestStep.pass_2(strMessage);
        break;
      }else{
      SelectQuickTabIcons("Products")
      tViewPrdBtn="//button[@id='ctrln-products-mode-0']"
      tTableNameCol=`//div[@role='rowgroup' and @ref='eCenterContainer' ]//div[@col-id='${columnName}']//span[@class='ag-group-value']`
      //ClickAndWaitCSS(tViewPrdBtn,tTableNameCol)  
      if(objSearchIcon.Exists ){
        aqUtils.Delay(1000)
         objSearchIcon.HoverMouse()
        objSearchIcon.Click((objSearchIcon.Width/4)+i,(objSearchIcon.Height/4)+i) 
      Log.Warning("column search pop was not displayed... retrying again")
      }
      
      }
    }
    return enabledFilter;
    }else{
      return enabledFilter;
    }
    
  }catch(e){ 
    strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestStep.fail_2(strMessage);
  }finally{
    Log.PopLogFolder();
  }
}

 

//parameter tab icon name like Products,Fast Edits etc...
//tabName="Products"
function SelectQuickTabIcons(tabName){
  try{
    tIconTab=`//a[@data-original-title='${tabName}']`
    theader="//main[@id='ctrln-fastedits-window']//h1[@class='h2 mb-0 dpi_title']"
    WaitForObjectCSS(tIconTab)
    objExp = ClickAndWaitCSS(tIconTab, theader)
    objHeader=FindElementCSS(theader)
  
    if(aqString.Find(objHeader.contentText,tabName,0,false)!=-1){
      Log.Message(`Navigated to '${tabName}' page`)
    } 
   }catch(e){
     Log.Error(`'${tabName}' page was not found..` +e.Message)
   }
      
}
 

function DeleteProductTableData(){
  try{
    fnTitle = "Deleting all data in table";
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle)
    tEditPrdBtn="//button[@id='ctrln-products-mode-1' and text()='Edit Products']"
    ClickButtonCSS(tEditPrdBtn)
    aqUtils.Delay(1000)
    tCheckBx="//div[@role='row' and @row-index]//input[@ref='eInput' and @type='checkbox']"
    objCheckBoxList=FindElementsCSS(tCheckBx)
    
    while (objCheckBoxList.length>0){
        
        tTableNameCol=`//div[@role='rowgroup' and @ref='eCenterContainer' ]//div[@col-id='name']//span[@class='ag-group-value']`
        childObjects=FindElementsCSS(tTableNameCol)
        for(i=0;i<objCheckBoxList.length;i++){
          objCheckBox=objCheckBoxList[i]
          if(objCheckBox.Exists && (objCheckBox.Visible || objCheckBox.VisibleOnScreen) && objCheckBox.Enabled ){
            objCheckBox.WaitProperty("Enabled", true, 2000)
            objCheckBox.Click()
            utilities.TestStep.pass_2("Successfully deleted the "+childObjects[i].contentText);
          }
        }
        Sys.Refresh()
        tDeleteBtn="//button[@id='ctrln-products-delete']"
        ClickButtonCSS(tDeleteBtn)
        //no row selected 
        tClosePopup="//div[text()='No products selected!']//..//button[@class='bootbox-close-button close']"
        objClose=FindElementCSS(tClosePopup)
        if(objClose.Exists){
          objClose.Click()
        }else{
        tProceedBtn="//button[contains(@class,'bootbox-accept') and text()='Proceed']"
        ClickButtonCSS(tProceedBtn)
        }
        aqUtils.Delay(1000)
        Sys.Refresh()
        objCheckBoxList=FindElementsCSS(tCheckBx)
        if(objCheckBoxList.length==0){
          break;
        }
    }
    aqUtils.Delay(1000,"Loading table")
    objCheckBoxList=FindElementsCSS(tCheckBx)
    if(objCheckBoxList.length==0){
      strMessage = "Deleted the table data"
      LogCheckpoint(strMessage)
      utilities.TestStep.pass_2(strMessage);
    }else{
      Log.Warning("Table data was not deleted...!!! ")
    }
  }catch(e){
    strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestStep.fail_2(strMessage);
  }finally{
    Log.PopLogFolder();
  }
}

function AddProducts(sProducts ){
  try{   
    fnTitle = "Adding product(s) ";
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle)
    
    tTextBox="//textarea[@id='ctrln-products-add-gcas']"
    objTextBox=FindElementCSS(tTextBox)
    sPrdList=sProducts//sProducts.join(",")
    objTextBox.Click()
    objTextBox.Keys("^a[BS]")
    objTextBox.Keys(sPrdList)
   
    tAddBtn="//button[@id='ctrln-products-add-button']"
    ClickButtonCSS(tAddBtn)
    tEnvsearchPopup="//div[@class='modal-content']//p[contains(text(),'Requesting Enovia Data')]"
    PrdNotadded="//div[@class='modal-dialog']//div[contains(text(),'Found GCAS codes that are not 8 characters long')]"
    objInvalidPrd=FindElementCSS(PrdNotadded)
    if(objInvalidPrd.Exists){
        LogCheckpoint("Product is not allowed to added."+sPrdList)
        tOkBtn="//button[@class='btn btn-primary bootbox-accept' and text()='OK']"
        ClickButtonCSS(tOkBtn)
        utilities.TestStep.pass_2("Product is not allowed to added."+sPrdList)
    }else{
    tAddAllOkBtn="//button[@id='ctrln-products-add-4real']"
    objEnvTxtBox=FindElementCSS(xpath.selectEnoviaEnvCmb)
    if(objEnvTxtBox.Exists && (objEnvTxtBox.Visible || objEnvTxtBox.VisibleOnScreen)){
      
      var tSelectEnoviaEnvCmb = xpath.selectEnoviaEnvCmb;
      var tEnoviaEnvOKBtn = xpath.okEnoviaEnvBtn;
      var tEnoviaEnvPwdTB = xpath.enoviaEnvPwdTB;
 
      EnterValue_KeysCSS(tSelectEnoviaEnvCmb, "QA")
      ClickButtonCSS(tEnoviaEnvOKBtn)
      objPwd=FindElementCSS(tEnoviaEnvPwdTB)
      if(objPwd.Exists){
        EnterValue_KeysCSS(tEnoviaEnvPwdTB,utilities.authPassword)
      }
    
      tOkBtn="//button[@class='btn btn-primary bootbox-accept' and text()='OK']"  
      
      objOkBtn=FindElementCSS(tOkBtn)
      if(objOkBtn.Exists){
        ClickButtonCSS(tOkBtn) 
      }
        
      utilities.TestStep.pass_2("Successfully added :"+sPrdList)
      
    }
    while (true){
      objPopup=FindElementCSS(tEnvsearchPopup)
      if(!objPopup.Exists){
        break;
      }else if(objPopup.Exists){
       objAllokBtn=FindElementCSS(tAddAllOkBtn)
       if(objAllokBtn.Exists){
         objAllokBtn.Click()
         break;
       }
      }else{
        aqUtils.Delay(500)
      }
    }
    }
    
  }catch(e){
    strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestStep.fail_2(strMessage);
  }finally{
     objEnvPopUp=FindElementCSS("//h5[text()='Enovia Integration']")
    if(objEnvPopUp.Exists){
      ClickButtonCSS("//div[@class='modal-dialog']//button[text()='Cancel']")
      }
    Log.PopLogFolder();
  }
}

function verifyTheAddedProducts(sProducts,delimeter){
  try{
    fnTitle = "Verifying the added products ";
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle)
    aqUtils.Delay(100,"loading table...")
    tTableNameCol="//div[@role='rowgroup' and @ref='eCenterContainer' ]//span[@ref='eCellValue' and @aria-colindex='1']"
    tAddBtn="//button[@id='ctrln-products-add-button']"
    while (true){
      tAddBtn="//button[@id='ctrln-products-add-button']"
      objAddbtn=FindElementCSS(tAddBtn)
      if(objAddbtn.Exists && (objAddbtn.Visible || objAddbtn.VisibleOnScreen)){
        break;
      }else{
        aqUtils.Delay(500,"loading tables..")
      }
    }
    listProducts =sProducts.split(",")
    WaitForObjectCSS(tTableNameCol) 
    childObjects=FindElementsCSS(tTableNameCol)
    for(j=0;j<listProducts.length;j++){
      productFlag=false
      let originalName;
      if(aqString.Find(listProducts[j],delimeter,0,false)!=-1){
        replaceStr=aqString.Replace(listProducts[j],delimeter,' (',false)
        originalName=replaceStr+')'
      }else{
        originalName=listProducts[j]
      }
      
      for (var i = 0; i < childObjects.length; i++) {
        var childValue = childObjects[i].contentText;
      
        if (aqString.Find( childValue,originalName,0,false)!=-1) {
          strMessage = "Product Was added : " + originalName
          LogCheckpoint(strMessage)
          utilities.TestStep.pass_2(strMessage);
          productFlag=true;
          break;
        }  
      }
     
      if(!productFlag && (delimeter=='.' || delimeter=='_')){
          strMessage = fnTitle + "Product Was not added : " + originalName
          LogError(strMessage);
          utilities.TestStep.fail_2(strMessage);
      }else if((delimeter!='.' || delimeter!='_') && !productFlag){
          strMessage = "Product will not allow to add  "+originalName
          LogCheckpoint(strMessage)
          utilities.TestStep.pass_2(strMessage);
      }
    }
  }catch(e){
    strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestStep.fail_2(strMessage);
  }finally{
    Log.PopLogFolder();
  }
}

 
function ViewSuperSet(){
  try{
      fnTitle = "View Superset of product data";
      utilities.TestStep = utilities.TestCase.createNode(fnTitle);
      Log.AppendFolder(fnTitle)
      tViewPrdBtn="//button[@id='ctrln-products-mode-2']"
      ClickButtonCSS(tViewPrdBtn)
  
      tTableNameCol="//div[@role='rowgroup' and @ref='eCenterContainer' ]//div[@col-id='name']//span[@class='ag-group-value']"
      childObjects=FindElementsCSS(tTableNameCol)
      if(childObjects.length>0){
        productName=childObjects[0].contentText
        columnName="name"
        columnIconXpath="(//div[contains(@class,'ag-header-') and @col-id='name']//span[@class='ag-icon ag-icon-menu'])[2]"
        FilerSelectedTableColumn(columnIconXpath,columnName,productName)
      
        tExtendAssignColVal="//div[@role='rowgroup' and @ref='eCenterContainer' ]//div[@col-id='assigned']"
        objAssignedList=FindElementsCSS(tExtendAssignColVal)
        for(i=0;i<objAssignedList.length;i++){
          //Sys.HighlightObject(objAssignedList[i])
          if(objAssignedList[i].contentText=="Yes"){
            Log.Message(" product was assigned ::"+productName)
            utilities.TestStep.pass_2("product was assigned ::"+productName);
          }else{
            Log.Message("product was not assigned ::"+productName)
            utilities.TestStep.pass_2("Assign column has 'No' value");
          }
        }
        tExtendAssignColVal="//div[@role='rowgroup' and @ref='eCenterContainer' ]//div[@col-id='linked']"
        objAssignedList=FindElementsCSS(tExtendAssignColVal)
        for(i=0;i<objAssignedList.length;i++){
          //Sys.HighlightObject(objAssignedList[i])
          if(objAssignedList[i].contentText=="Yes"){
            Log.Message(" product was Linked ::"+productName)
          }else{
            Log.Message("product was not Linked ::"+productName)
          }
       
        }
      }else{
        Log.Warning("There is no data in table")
      }
  }catch(e){
    strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestStep.fail_2(strMessage);
  }finally{
    Log.PopLogFolder();
  }
  
}

function fetchFromEnovia(){
 
  try{
    fnTitle = "Fetch Data from enovia";
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle)
    
    arrMIWithRev=Project.Variables.NewMiNo;
    argMI =arrMIWithRev.split(" ")
    miName = argMI[0];
    revision = argMI[1];
    EnterValueCSS(xpath.MINameTB, miName)
    EnterValueCSS(xpath.MIRevisionTB, revision)
    ClickAndWaitCSS(xpath.fetchFromEnoviaBtn, xpath.selectEnoviaEnvCmb) 
    EnterValue_KeysCSS(xpath.selectEnoviaEnvCmb, "QA") 
    ClickAndWaitCSS(xpath.okEnoviaEnvBtn, xpath.enoviaEnvPwdTB)
    EnterValue_KeysCSS(xpath.enoviaEnvPwdTB, utilities.authPassword)
    ClickButtonCSS(xpath.okEnoviaEnvBtn)
    //ClickAndWaitCSS(xpath.okEnoviaEnvBtn, xpath.enoviaLinkErrorMsg)
    tChangeBtn="//button[text()='Accept Enovia Changes...']"
    objChangeBtn=FindElementCSS(tChangeBtn)
    if(objChangeBtn.Exists){
      objChangeBtn.Click()
       utilities.TestStep.pass_2("Accepting the enovia changes :"+miName)
      LogCheckpoint("Accepting the enovia changes")
    }
    tErrMsg="//div[@id='ctrln-products-enovia-status']//strong[contains(text(),'It is not possible to proceed')]"
    objErrorMsg=FindElementCSS(tErrMsg)
    if(objErrorMsg.Exists){
      Log.Warning(objErrorMsg.contentText)
      
      utilities.TestStep.fail_2(objErrorMsg.contentText);
      ClickButtonCSS(xpath.closeWindowBtn)
    } 
//    sEnoviaLinkStatus = GetPropertyValue(xpath.enoviaLinkStatusMsg, "innerText")
//    LogCheckpoint("Expected error message displayed.")
//    LogCheckpoint(sEnoviaLinkStatus)
    }catch(e){
    strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestStep.fail_2(strMessage);
  }finally{
    Log.PopLogFolder();
  }
}



function deleteAllActiveFilter(){
  try{
    fnTitle = "Deleting All active filter";
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle)

    tDeleteFilterBtns="//div[@id='ctrln-products-filters']//button[@class='btn btn-sm btn-purple']"
    objDeleteBtns=FindElementsCSS(tDeleteFilterBtns)
    for(i=0;i<objDeleteBtns.length;i++){
      objDeleteBtns[i].Click()  
      tDeleteBtn="//div[@class='dropdown-menu show']//button"
      ClickButtonCSS(tDeleteBtn)
      aqUtils.Delay(3000)
      tProceedBtn="//div[@class='modal-dialog']//button[text()='Proceed']"
      WaitForObjectCSS(tProceedBtn)
      ClickButtonCSS(tProceedBtn)
      aqUtils.Delay(3000)
      utilities.TestStep.pass_2("Successfully Deleted Filter :"+objDeleteBtns[i].contentText) 
    }
    
  }catch(e){
    strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestStep.fail_2(strMessage);
  }finally{
    Log.PopLogFolder();
  }
}

function AddActiveFilter(filterName){
  
  try{
    fnTitle = "Adding active filter "+filterName;
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle)

    tAddFilter="//div[@id='ctrln-products-filters-container']//button[contains(text(),'New Filter')]"
    ClickButtonCSS(tAddFilter)
    tFiterBtn=`//button[contains(@id,'ctrln-products-filters-add') and contains(text(),'${filterName}')]`
    ClickButtonCSS(tFiterBtn)
    aqUtils.Delay(300)
    tAddedFilter=`//div[@id='ctrln-products-filters']//button[@class='btn btn-sm btn-purple' and contains(text(),'${filterName}')]`
    objAddedFil=FindElementCSS(tAddedFilter)
    if(objAddedFil.Exists){
      strMessage = filterName+" filter successfully added.."
      LogCheckpoint(strMessage)
      utilities.TestStep.pass_2(strMessage);
    }else{
      utilities.TestStep.fail_2(filterName+" was not added..!!");
      LogError(filterName+" was not added..!!")
    }
   }catch(e){
     strMessage = fnTitle + " was failed: " + e.message
      LogError(strMessage);
      utilities.TestStep.fail_2(strMessage);
   }finally{
    Log.PopLogFolder();
  }
    
}
//columnName="BP Group"
//filterValue=657
function editActiveFilterColumnValue(columnName,filterValue){
  try{ 
    fnTitle = "Edit column :"+columnName+" with "+filterValue;
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle)
    tColumn=`//div[@class='ag-header-row ag-header-row-column']//div[@ref='eLabel']//span[text()='${columnName}']//..//..//..`
    objColumnHeader=FindElementCSS(tColumn)
    columnId=objColumnHeader.getAttribute('col-id')
    tcolumnCell=`//div[@role='rowgroup' and @ref='eCenterContainer' ]//div[@col-id='${columnId}']`
    var rowCount=0;
    bjcolumnlist=FindElementsCSS(tcolumnCell)
    if(bjcolumnlist.length>5){
      rowCount=5
    }else if(bjcolumnlist.length>1 && bjcolumnlist.length <=5 ){
      rowCount=1
    }
    for(i=0;i<bjcolumnlist.length;i++){
      if(i<rowCount){
        bjcolumnlist[i].Click()
        bjcolumnlist[i].Keys(filterValue)
        bjcolumnlist[i].Keys("[Enter]")
        aqUtils.Delay(5000)
        utilities.TestStep.pass_2(columnName+" Added Filter Text for "+bjcolumnlist[i].contentText);
      }
    }
    tSaveBtn="//button[@id='ctrln-products-save-filters']"
    ClickButtonCSS(tSaveBtn)
    aqUtils.Delay(3000,"Saving Filter")
    tSaveContinue="//div[@class='modal-dialog']//button[text()='Continue with save']"
    objContinueBtn=FindElementCSS(tSaveContinue)
    if(objContinueBtn.Exists){
      aqUtils.Delay(3000,"Waiting for continue button")
      objContinueBtn.Click()
    }
    aqUtils.Delay(3000,'Verifying message')
    return [columnId,rowCount]
  }catch(e){
    strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestStep.fail_2(strMessage);
  }finally{
    Log.PopLogFolder();
  }  
}

//    filterValue="657"
//    columnName="filter_615"
function verifyFilteredData(columnName,filterValue,rowCount){
  try{
    fnTitle = "Verify column :"+columnName+" with :"+filterValue;
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle)
    SelectQuickTabIcons("Fast Edits")
    columnIconXpath=`//div[contains(@class,'ag-header-') and @col-id='min_target_max']//span[@class='ag-icon ag-icon-menu']`
    FilerSelectedTableColumn(columnIconXpath,"min_target_max","Target")
     
    columnIconXpath=`(//div[contains(@class,'ag-header-') and @col-id='${columnName}']//span[@class='ag-icon ag-icon-menu'])[2]`
    FilerSelectedTableColumn(columnIconXpath,columnName,filterValue)
   
    aqUtils.Delay(3000)
   // rowCount=1   
    tUnselect="//div[@ref='eLeftContainer']//div[@role='row']//div[@aria-colindex='1']" 
    objRowList=FindElementsCSS(tUnselect) 
    if(rowCount==objRowList.length){
       LogCheckpoint("Filtered row count matched...")
       utilities.TestStep.pass_2("Filtered rows count is matched ");
    }else{
       utilities.TestStep.fail_2("Filtered row count was not matched...");
      LogError("Filtered row count was not matched...")
    }
  }catch(e){
    strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestStep.fail_2(strMessage);
  }finally{
    Log.PopLogFolder();
  }
}

function ClickCheckButtonInProductPage(){
  try{  
    fnTitle = "Verify the check button functionality";
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle)
    tCheckBx="//div[@role='row' and @row-index]//input[@ref='eInput' and @type='checkbox']"
    objCheckBoxList=FindElementsCSS(tCheckBx)
    for(i=0;i<objCheckBoxList.length;i++){
      
      if(objCheckBoxList.length > 5 && i<5 ){
        objCheckBox=objCheckBoxList[i]
        objCheckBox.Click()
      }else if(objCheckBoxList.length <= 5){
        objCheckBox=objCheckBoxList[i]
        objCheckBox.Click()
        break
      }else{
        break;
      }
    }
    tCheckBtn="//button[@id='ctrln-products-check']"
    ClickButtonCSS(tCheckBtn) 
     
    
    tInfoColmnVal="//div[@ref='eCenterContainer' and @role='rowgroup']//div[@role='row']//div[@col-id='info' and contains(text(),'Found')]"
    objEnvTxtBox=FindElementCSS(xpath.selectEnoviaEnvCmb)
    if(objEnvTxtBox.Exists){
      
      var tSelectEnoviaEnvCmb = xpath.selectEnoviaEnvCmb;
      var tEnoviaEnvOKBtn = xpath.okEnoviaEnvBtn;
      var tEnoviaEnvPwdTB = xpath.enoviaEnvPwdTB;
 
      EnterValue_KeysCSS(tSelectEnoviaEnvCmb, "QA")
  
      ClickAndWaitCSS(tEnoviaEnvOKBtn, tEnoviaEnvPwdTB)
      EnterValue_KeysCSS(tEnoviaEnvPwdTB, utilities.authPassword)
    
      tOkBtn="//button[@class='btn btn-primary bootbox-accept' and text()='OK']"
      tAddAllOkBtn="//button[@id='ctrln-products-add-4real']"
     
      ClickAndWaitCSS(tOkBtn,tInfoColmnVal)
    }
    tEnvsearchPopup="//div[@class='modal-content']//p[contains(text(),'Requesting Enovia Data')]"
    aqUtils.Delay(3000)
    while (true){
      objPopup=FindElementCSS(tEnvsearchPopup)
      if(!objPopup.Exists){
        break;
      }else{
        aqUtils.Delay(500)
      }
    }
    
    objInfoColValue=FindElementCSS(tInfoColmnVal)
    if(objInfoColValue.Exists){
      utilities.TestStep.pass_2("Selected rows is updated from enovia ");
      LogCheckpoint("Updated value from enovia ")
    }else{
      utilities.TestStep.fail_2("Getting error while updating from enovia");
      LogError(" while updating row value by using Check button")
    }
  }catch(e){
    strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestStep.fail_2(strMessage);
  }finally{
    Log.PopLogFolder();
  }
}

function ClickRefreshButtonInProductPage(){
  try{  
    fnTitle = "Verifying the Refresh button functionality ";
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle)
    tCheckBx="//div[@role='row' and @row-index]//input[@ref='eInput' and @type='checkbox']"
    objCheckBoxList=FindElementsCSS(tCheckBx)
         
    for(i=0;i<objCheckBoxList.length;i++){
      
      if(objCheckBoxList.length > 5 && i<5 ){
        objCheckBox=objCheckBoxList[i]
        objCheckBox.Click()
      }else if(objCheckBoxList.length <= 5){
        objCheckBox=objCheckBoxList[i]
        objCheckBox.Click()
        break
      }else{
        break;
      }
    }
    tRefreshBtn="//button[@id='ctrln-products-refresh']"    
    ClickButtonCSS(tRefreshBtn) 
    tEnvsearchPopup="//div[@class='modal-content']//p[contains(text(),'Requesting Enovia Data')]"
    aqUtils.Delay(3000)
    
    tInfoColmnVal="//div[@ref='eCenterContainer' and @role='rowgroup']//div[@role='row']//div[@col-id='info' and contains(text(),'Existing')]"
    objEnvTxtBox=FindElementCSS(xpath.selectEnoviaEnvCmb)
    if(objEnvTxtBox.Exists && (objEnvTxtBox.VisibleOnScreen || objEnvTxtBox.Visible)){
      var tSelectEnoviaEnvCmb = xpath.selectEnoviaEnvCmb;
      var tEnoviaEnvOKBtn = xpath.okEnoviaEnvBtn;
      var tEnoviaEnvPwdTB = xpath.enoviaEnvPwdTB;
 
      EnterValue_KeysCSS(tSelectEnoviaEnvCmb, "QA")
      ClickButtonCSS(tEnoviaEnvOKBtn)
      objPwsTx=FindElementCSS(tEnoviaEnvPwdTB)
      if(objPwsTx.Exists && (objPwsTx.Visible || objPwsTx.VisibleOnScreen)){
        //ClickAndWaitCSS(tEnoviaEnvOKBtn, tEnoviaEnvPwdTB)
        EnterValue_KeysCSS(tEnoviaEnvPwdTB, utilities.authPassword)
    
        tOkBtn="//button[@class='btn btn-primary bootbox-accept' and text()='OK']"
        tAddAllOkBtn="//button[@id='ctrln-products-add-4real']"
        ClickButtonCSS(tOkBtn)
      }
      //ClickAndWaitCSS(tOkBtn,tInfoColmnVal)
    }
    while (true){
      objPopup=FindElementCSS(tEnvsearchPopup)
      if(!objPopup.Exists){
        break;
      }else{
        aqUtils.Delay(500)
      }
    }
    objInfoColValue=FindElementCSS(tInfoColmnVal)
    if(objInfoColValue.Exists){
      utilities.TestStep.pass_2("Selected Record is updated from enovia ");
      LogCheckpoint("Updated value from enovia ")
    }else{
      utilities.TestStep.fail_2("Getting error while updatinf from enovia");
      Log.Warning("getting error while updating row value by using Check button")
    }
  }catch(e){
   strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestStep.fail_2(strMessage);
  }finally{
    Log.PopLogFolder();
  }
}

function VerifyDataInFastEdit(){
  try{
    fnTitle = "Verifying Data in Fast Edit based on Intermidiate stream ";
    utilities.TestStep = utilities.TestCase.createNode(fnTitle);
    Log.AppendFolder(fnTitle)
    
    SelectQuickTabIcons("Fast Edits")
    columnIconXpath=`//div[contains(@class,'ag-header-') and @col-id='min_target_max']//span[@class='ag-icon ag-icon-menu']`
    FilerSelectedTableColumn(columnIconXpath,"min_target_max","Target")
    
    //validating Phase 2's column phase-1 sum values
    tColumnHeader="//span[@class='ag-header-cell-text' and @role='columnheader' and text()='Phase 1']"
    objColmHeader=FindElementCSS(tColumnHeader)
    Sys.HighlightObject(objColmHeader)
    columnIndex=objColmHeader.getAttribute('aria-colindex')
    tColumndata=`//div[@role='gridcell' and @aria-colindex='${columnIndex}']`
    objColData=FindElementsCSS(tColumndata)
    for(i=3;i<objColData.length;i++){
     if(objColData[i].contentText!='' || objColData[i].contentText !="" || objColData[i].contentText!='undefind'){
      LogCheckpoint(" Phase I sum values "+objColData[i].contentText) 
      utilities.TestStep.pass_2(" Phase I sum values : "+objColData[i].contentText);    
     }else{
       utilities.TestStep.fail_2(" Phase I sum values : "+objColData[i].contentText);
       LogError(" Phase I sum values : "+objColData[i].contentText)
     }
    }
  }catch(e){
   strMessage = fnTitle + " was failed: " + e.message
    LogError(strMessage);
    utilities.TestStep.fail_2(strMessage);
  }finally{
    Log.PopLogFolder();
  }
}