/* eslint-disable @typescript-eslint/naming-convention */
import {environment} from '../../environments/environment';







export class EndPointConst {

    // admin login
    public static LOGIN = environment.server + '/auth/login';


  public static REQUEST_OTP = environment.server + '/auth/store/otp';
  public static VERIFY_OTP = environment.server + '/auth/store/login';

  public static LOGOUT = environment.server + '/auth/logout';

  public static REFRESH_TOKEN = environment.server + '/auth/renew-token';
  public static USER_REGISTRATION = environment.server + '/auth/signUp';

  public static CANDIDATE_SIGN_UP = environment.server + '/auth/candidate/signUp';
  public static COMPANY_SIGN_UP = environment.server + '/auth/company/signUp';

  //Profile
  public static GET_CATEGORY_LIST_DROPDOWN = environment.server + '/category/drop-down/all';
  public static CREATE_PROFILE = environment.server + '/profile/create';
  public static GET_MY_PROFILE = environment.server + '/profile/findMyProfile';
  public static UPDATE_MY_PROFILE = environment.server + '/profile/updateMyProfile';

  public static GET_PRESIGNED_S3_URL = environment.server + '/aws/preSignedUrl';

  // category
  public static GET_ALL_CATEGORY = environment.server + '/category/all';
  public static CREATE_CATEGORY = environment.server + '/category/create';
  public static GET_CATEGORY_BY_ID = environment.server + '/category/find';
  public static UPDATE_CATEGORY_BY_ID = environment.server + '/category/update';
  public static DELETE_CATEGORY_BY_ID = environment.server + '/category/delete';
public static GET_ALL_CATEGORY_DROPDOWN = environment.server + '/category/admin-drop-down/all'

// sub category
public static GET_ALL_SUB_CATEGORY = environment.server + '/sub-category/all';
public static GET_SUB_CATEGORY_BY_ID = environment.server + '/sub-category/find';
public static CREATE_SUB_CATEGORY = environment.server + '/sub-category/create';
public static UPDATE_SUB_CATEGORY_BY_ID = environment.server + '/sub-category/update';
  public static GET_ALL_SUB_CATEGORY_BY_CAT_ID_DROP_DOWN = environment.server + '/sub-category/drop-down/all';


  //Profile
  public static GET_USER_ROLES = environment.server + '/profile/roles';
  public static GET_USER_LIST = environment.server + '/profile/all';


  //store
  // public static CREATE_STORE = environment.server + '/store/create';
  public static UPDATE_STORE = environment.server + '/store/admin-update';
  public static GET_STORE_BY_ID = environment.server + '/store/admin-find';
  // public static GET_ALL_STORE_DROP_DOWN = environment.server + '/category/drop-down/all';

  public static GET_ALL_STORES = environment.server + '/store/find-all';
  public static ADMIN_STORE_ONLINE_UPDATE = environment.server + '/store/store-online-toggle-admin';
  public static ADMIN_STORE_UPDATE = environment.server + '/store/admin-update';




  // public static FIND_JOB_DETAILS = environment.server + "/job-post/find";

  public static STORE_CATALOG = environment.server + '/catalog/all';

  public static GET_ALL_STORE_BY_CATEGORY_ID = environment.server + '/store/find-by-location';








//////////////////// users /////////
public static GET_USER_BY_ID = environment.server + '/auth/admin-find-user';










///store type////////
  public static GET_ALL_STORE_TYPE_DROP_DOWN = environment.server + '/store-type/drop-down/all';



  // public API

  public static GET_ALL_COUNTRY = 'https://countriesnow.space/api/v0.1/countries/positions';
  public static GET_ALL_CITY = 'https://countriesnow.space/api/v0.1/countries/state/cities';
  public static GET_ALL_STATE = 'https://countriesnow.space/api/v0.1/countries/states';




  ///////////////////////// Product list //////////////////////
  public static GET_PRODUCT_SCHEMA = environment.server + '/catalog/';
  public static STORE_PRODUCT_CATALOG = environment.server + '/store-product-catalog/my-shop';
  public static STORE_PRODUCT_CATALOG_AUTH = environment.server + '/store-product-catalog/my-shop-auth';


  ///// STORE PRODUCT /////////////////
  public static CREATE_STORE_PRODUCT = environment.server + '/store-product-catalog/create';
  public static UPDATE_STORE_PRODUCT = environment.server + '/store-product-catalog/update';
  public static STATUS_UPDATE_STORE_PRODUCT = environment.server + '/store-product-catalog/status-update';
  public static GET_CATALOG_ID_BY_BARCODE = environment.server + '/catalog/barcode';






  //////////////////// ORDER /////////////////////////////// IN USE
  public static ORDERS = environment.server + '/order/strict/list';
  public static GET_ORDER_DETAILS = environment.server + '/order/strict/details';
  public static UPDATE_ORDER_STATUS_ADMIN = environment.server + '/order/strict/update-status';
  // public static DELIVERED_STATUS_CHANGE = environment.server + '/order/delivered';
  // public static ORDER_STATUS = environment.server + '/order/filter-order-status';


  ////////////////////////////////////Support ///////////////////
  public static SUPPORT_TICKET = environment.server + '/support/create';

  ////////////////////////////////////Master Catalog ///////////////////
  public static GET_MASTER_CATALOG = environment.server + '/catalog/admin/all';
  public static CREATE_MASTER_CATALOG = environment.server + '/catalog/create';
  public static GET_MASTER_CATALOG_BY_ID = environment.server + '/catalog/find';
  public static UPDATE_MASTER_CATALOG_BY_ID = environment.server + '/catalog/update';


  ////////////////////////////////////Master Catalog ///////////////////
  public static GET_EXCEL_DUMP_CATALOG = environment.server + '/excel-upload/all';
  public static GET_EXCEL_DUMP_BY_ID = environment.server + '/excel-upload/find';
  public static DELETE_EXCEL_DUMP_BY_ID = environment.server + '/excel-upload/delete';
  // public static UPDATE_MASTER_CATALOG_BY_ID = environment.server + '/catalog/update';






}
