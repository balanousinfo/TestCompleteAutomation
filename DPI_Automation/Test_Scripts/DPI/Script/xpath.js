﻿
var usernameTb  = "//form[@name='pgloginform']//input[@id='username']";
var passwordTb  = "//form[@name='pgloginform']//input[@id='password']";
var signonBtn   = "//form[@name='pgloginform']//button[@id='loginButton']";
var pngLogo     = "//img[@class='img-fluid']"

var searchRepoTB  = "//input[@id='ctrln-dashboard-repository-search']";
var gcasTbl       = "//div[@class='ag-center-cols-container' and @ref='eCenterContainer']";
var firstRow      = "//div[@class='ag-center-cols-container' and @ref='eCenterContainer']/div[@row-index='0']"

var revInfoBtn    = "//a[@class='btn btn-repo btn-primary']"

var selectMakingAreaBtn = "//button[@id='ctrln-header-makingarea']"
var makingAreaValue = "//div[@id='ctrln-header-makingarea-choose']//span[text()='Liquids Making']"
var chooseMakingAreaBtn = "//button[@id='ctrln-header-makingarea-choose-button']"
var closeWindowBtn = "//button[@class='bootbox-close-button close']"

var checkoutstatusLbl   = "//div[text()='Checkout Status']"
var checkoutMessageLbl  = "//div[@class='toast-message']"

var fastEditBtn = "//a[@data-original-title='Fast Edits']"
var saveBtn = "//button[@id='ctrln-fastedits-save']"
var fastEditcheckinBtn = "//button[@id='ctrln-fastedits-checkin']"
var fastEditCheckoutBtn = "//button[@id='ctrln-fastedits-checkout']" 
var checkinBtn = "//button[@id='ctrln-header-checkin']"
var checkoutBtn = "//button[@id='ctrln-header-checkout']"

var copyToReviseBtn = "//button[@id='ctrln-repository-new-version-button']";
var copyToCreateNewBtn = "//button[@id='ctrln-repository-copy-button']";
var viewMIBtn     = "//button[@id='ctrln-repository-view-button']";

var MICopiedMessage = "//strong[text()='Making Instruction Copied! Added to your recent MIs']";
var viewMIHeader = "//div[@class='card']//*[text()=' Identification ']";
var viewRecentMIBtn = "//div[@id='ctrln-dashboard-recents']/div//button[text()='View...']"
var MINameTB = "//input[@id='ctrln-header-name']"
var MIRevisionTB = "//input[@id='ctrln-header-revision']"
var fetchFromEnoviaBtn = "//button[text()='Fetch From Enovia']"
var selectEnoviaEnvCmb = "//select[@class='bootbox-input bootbox-input-select form-control']"
var enoviaEnvPwdTB = "//input[@class='bootbox-input bootbox-input-password form-control']"
var okEnoviaEnvBtn = "//button[@class='btn btn-primary bootbox-accept']"
var enoviaLinkErrorMsg = "//strong[text()='It is not possible to proceed with this Enovia linkage because:']"
var enoviaLinkStatusMsg = "//div[@id='ctrln-products-enovia-status']"

var dpiOwnersLbl = "//*[@id='ctrln-header-container']//small[text()='DPI Owner: ']/following-sibling::*"

var menuBtn = "//a[@class='btn btn-outline-secondary btn-sm' and text()='Menu...']"
var logoffBtn = "//a[@id='ctrln-sidebar-logoff']"

//############### Product page #####################
tCurrRow_0 = "//div[@class='ag-center-cols-container' and @ref='eCenterContainer']/div[@row-id='0']"
   
tHomepage="//img[@class='img-fluid']"  
tEditPrdBtn="//button[@id='ctrln-products-mode-1']" 
tViewPrdBtn="//button[@id='ctrln-products-mode-0']"
tSetIntermediateYesBtn="//label[@for='ctrln-header-intermediate-active']//..//label[text()='Yes']"
tSetIntermediateNoBtn="label[@for='ctrln-header-intermediate-active']//..//label[text()='No']"


