import {environment} from '../../environments/environment';

export class EndPointConst {
    public static REQUEST_OTP = environment.server + "/auth/store/otp";
    public static VERIFY_OTP = environment.server + "/auth/store/login";

    public static UPDATE_FCM_TOKEN = environment.server + "/auth/fcm-token";


    public static LOGOUT = environment.server + "/auth/logout";

    public static REFRESH_TOKEN = environment.server + "/auth/renew-token"
    public static USER_REGISTRATION = environment.server + "/auth/signUp";

    public static CANDIDATE_SIGN_UP = environment.server + "/auth/candidate/signUp";
    public static COMPANY_SIGN_UP = environment.server + "/auth/company/signUp";

    //Profile
    public static GET_CATEGORY_LIST_DROPDOWN = environment.server + "/category/drop-down/all";
    public static CREATE_PROFILE = environment.server + "/profile/create";
    public static GET_MY_PROFILE = environment.server + "/profile/findMyProfile";
    public static UPDATE_MY_PROFILE = environment.server + "/profile/updateMyProfile";

    public static GET_PRESIGNED_S3_URL = environment.server + "/aws/preSignedUrl"

    // category
    public static GET_ALL_CATEGORY = environment.server + "/category/active/all";
    public static GET_ALL_SUB_CATEGORY = environment.server + "/sub-category/active";
    public static GET_ALL_SUB_CATEGORY_BY_CAT_ID_DROP_DOWN = environment.server + "/sub-category/drop-down/all-active";
    public static GET_ALL_SUB_CATEGROY_DROP_DROP_DOWN =  environment.server + "/sub-category/drop-down/all";

    
    //Profile
    public static GET_USER_ROLES = environment.server + "/profile/roles"
    public static GET_USER_LIST = environment.server + "/profile/all"


    //store
    public static CREATE_STORE = environment.server + "/store/create";
    public static UPDATE_STORE = environment.server + "/store/update";
    public static GET_STORE = environment.server + "/store/find";
    public static GET_STORE_CATEGORY = environment.server + "/store/store-category";
    public static GET_ALL_CATEGORY_DROP_DOWN = environment.server + "/category/drop-down/all";
    public static UPDATE_STORE_ONLINE_STATUS = environment.server + "/store/store-online-toggle";

    public static GET_ALL_STORE_TYPE_DROP_DOWN = environment.server + "/store-type/drop-down/all";


    public static GET_CATALOG_BY_ID = environment.server + "/catalog/find/store";



    // public static FIND_JOB_DETAILS = environment.server + "/job-post/find";

    public static STORE_CATALOG = environment.server + "/catalog/all";

    public static GET_ALL_STORE_BY_CATEGORY_ID = environment.server + "/store/find-by-location";


    // public API

    public static GET_ALL_COUNTRY = "https://countriesnow.space/api/v0.1/countries/positions";
    public static GET_ALL_CITY = "https://countriesnow.space/api/v0.1/countries/state/cities";
    public static GET_ALL_STATE = "https://countriesnow.space/api/v0.1/countries/states";




    ///////////////////////// Product list //////////////////////
    public static GET_PRODUCT_SCHEMA = environment.server + "/catalog/";
    public static STORE_PRODUCT_CATALOG = environment.server + "/store-product-catalog/my-shop";
    public static STORE_PRODUCT_CATALOG_AUTH = environment.server + "/store-product-catalog/my-shop-auth";
    public static GET_ACTIVE_SUB_CATEGORY_BY_CAT_ID_DROP_DOWN = environment.server + "/store-product-catalog/store/active-sub-category";


    ///// STORE PRODUCT /////////////////
    public static CREATE_STORE_PRODUCT = environment.server + "/store-product-catalog/create";
    public static UPDATE_STORE_PRODUCT = environment.server + "/store-product-catalog/update";
    public static STATUS_UPDATE_STORE_PRODUCT = environment.server + "/store-product-catalog/status-update";
    public static GET_CATALOG_ID_BY_BARCODE = environment.server + "/catalog/barcode";


//////// Request Catalog ///////////////////
    public static CREATE_STORE_REQ_CATALOG = environment.server + "/request-catalog/create";
    public static UPDATE_STORE_REQ_CATALOG = environment.server + "/request-catalog/update";
    public static GET_ALL_STORE_REQ_CATALOG = environment.server + "/request-catalog/my-shop";


    //////////////////// CART ///////////////////////////////
    public static ADD_TO_CART = environment.server + "/cart/create";
    public static UPDATE_TO_CART = environment.server + "/cart/update";
    public static GET_TOTAL_CART_COST = environment.server + "/cart/total-cart-cost";
    public static GET_CUSTOMER_CART = environment.server + "/cart/find-customer-cart";

    //////////////////// ORDER ///////////////////////////////
    public static MY_ORDER = environment.server + "/order/store";
    public static GET_ORDER_DETAILS = environment.server + "/order/details/store"
    public static READY_TO_DELIVERED_STATUS_CHANGE = environment.server + "/order/ready-to-delivered"
    public static DELIVERED_STATUS_CHANGE = environment.server + "/order/delivered"
    public static ACCEPT_STATUS_CHANGE = environment.server + "/order/accept"
    public static REJECT_STATUS_CHANGE = environment.server + "/order/reject"

    public static ORDER_STATUS = environment.server + "/order/filter-order-status";


    ////////////////////////////////////Support ///////////////////
    public static SUPPORT_TICKET = environment.server + "/support/create";
    public static VERSION_CHECK = environment.server + "/auth/store-version-check";


}
