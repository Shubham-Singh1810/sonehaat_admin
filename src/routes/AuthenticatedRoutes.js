import React from 'react';
import {Route, Routes} from "react-router-dom"
import Dashboard from '../Pages/Dashboard/Dashboard';
import CategoriesList from '../Pages/Category/CategoriesList';
import SubCategoriesList from '../Pages/Category/SubCategoryList';
import BrandsList from '../Pages/Brand/BrandsList';
import AttributeSetList from '../Pages/Attribute/AttributeSetList';
import AttributeList from '../Pages/Attribute/AttributeList';
import DriverList from '../Pages/Driver/DriverList';
import VendorList from '../Pages/Vendor/VendorList';
import BannerList from '../Pages/Banner/BannerList';
import DriverApproval from '../Pages/Driver/DriverApproval';
import TagList from '../Pages/Tag/TagList';
import ProductTypeList from '../Pages/Product/ProductTypeList';
import TaxList from '../Pages/Tax/TaxList';
import ProductManufactureLocactionList from '../Pages/Product/ProductManufactureLocationList';
import ProductList from '../Pages/Product/ProductList';
import AddProduct from '../Pages/Product/AddProduct';
import VendorApproval from '../Pages/Vendor/VendorApproval';
import UserFaq from '../Pages/Support/Faq/UserFaq';
import UserTermsAndCondition from '../Pages/Support/TermsAndCondition/UserTermsAndCondition';
import ProductUpdateStep2 from '../Pages/Product/ProductUpdateStep2';
import DriverTermsAndCondition from '../Pages/Support/TermsAndCondition/DriverTermsAndCondition';
import VendorTermsAndCondition from '../Pages/Support/TermsAndCondition/VendorTermsAndCondition';
import ProductUpdateStep3 from '../Pages/Product/ProductUpdateStep3';
import NotificationList from '../Pages/Notification/NotificationList';
import ProductUpdateAttribute from '../Pages/Product/ProductUpdateAtrribute';
import RoleList from '../Pages/CommandCenter/RoleList';
import PermissionList from '../Pages/CommandCenter/PermissionList';
import AdminList from '../Pages/CommandCenter/AdminList';
import UserPrivacyPolicy from '../Pages/Support/PrivacyPolicy/UserPrivacyPolicy';
import DriverPrivacyPolicy from '../Pages/Support/PrivacyPolicy/DriverPrivacyPolicy';
import VendorPrivacyPolicy from '../Pages/Support/PrivacyPolicy/VendorPrivacyPolicy';
import ContactQueryList from '../Pages/Support/Contact/ContactQueryList';
import UserTicketList from '../Pages/SupportTickets/UserTicketList';
import DriverTicketList from '../Pages/SupportTickets/DriverTicketList';
import VendorTicketList from '../Pages/SupportTickets/VendorTicketList';
import TicketCategoryList from '../Pages/SupportTickets/TicketCategoryList';
import ChatBox from '../Pages/SupportTickets/ChatBox';
import ProductApproval from '../Pages/Product/ProductApproval';
import OrderList from '../Pages/Order/OrderList';
import CompletedOrderList from '../Pages/Order/CompletedOrderList';
import CancelledOrderList from '../Pages/Order/CancelledOrderList';
import TrackOrderList from '../Pages/Order/TrackOrderList';
import AssignDriverOrders from '../Pages/Order/AssignDriverOrders';
import ProductDetails from '../Pages/Product/ProductDetails';
import AdminTransectionHistory from '../Pages/FundMangement/AdminTransectionHistory';
import VendorWithdrawList from '../Pages/FundMangement/VendorWithrawList';
import DriverWithdrawList from '../Pages/FundMangement/DriverWithdrawList';
import UserList from '../Pages/User/UserList';
import NotifyList from '../Pages/Notification/NotifyList';
import DeliveryZipcode from '../Pages/DeliveryLocation/DeliveryZipcode';
import CouponList from '../Pages/PromoCode/CouponList';
import NLevelCategoryPage from '../Pages/Category/NlevelCategoryPage';
import CategoryDetailsPage from '../Pages/Category/CategoryDetailsPage';
import ProductUpdateStep1 from '../Pages/Product/ProductUpdateStep1';
import OrderDetails from '../Pages/Order/orderDetails';
import OrderInvoice from '../Pages/Order/OrderInvoice';
import DriverAdd from '../Pages/Driver/DriverAdd';
import VendorAdd from '../Pages/Vendor/VendorAdd';
import EditVendor from '../Pages/Vendor/EditVendor';
import EditDriver from '../Pages/Driver/EditDriver';
import OperationalCityList from '../Pages/DeliveryLocation/OperationalCityList';
import PickupLocationPage from '../Pages/DeliveryLocation/PickupLocation';
import IntercityOrderList from '../Pages/Order/IntercityOrderList';

function AuthenticatedRoutes() {
  return (
    <Routes>
        <Route path="/" element={<Dashboard/>}/>

        {/* categories  */}
        <Route path="/category-list" element={<CategoriesList/>}/>
        <Route path="/category-details/:id" element={<CategoryDetailsPage />} />
        <Route path="/sub-category-list" element={<SubCategoriesList/>}/>
        <Route path="/n-level-categories/:id" element={<NLevelCategoryPage />} />

        {/* attribute */}
        <Route path="/attribute-set-list" element={<AttributeSetList/>}/>
        <Route path="/attribute-list" element={<AttributeList/>}/>

        {/* brand */}
        <Route path="/brand-list" element={<BrandsList/>}/>

        {/* drivers */}
        <Route path="/driver-list" element={<DriverList/>}/>
        <Route path="/driver-approval/:id" element={<DriverApproval/>}/>
        <Route path="/add-driver" element={<DriverAdd/>}/>
        <Route path="/edit-driver/:id" element={<EditDriver/>}/>

        {/* vendor */}
        <Route path="/vendor-list" element={<VendorList/>}/>
        <Route path="/add-vendor" element={<VendorAdd/>}/>
        <Route path="/vendor-approval/:id" element={<VendorApproval/>}/>
        <Route path="/edit-vendor/:id" element={<EditVendor/>}/>

        {/* Banner */}
        <Route path="/banner-list" element={<BannerList/>}/>

        {/* tag */}
        <Route path="/tag-list" element={<TagList/>}/>

         {/* tax */}
         <Route path="/tax-list" element={<TaxList/>}/>


        {/* product type  */}
        <Route path="/product-type-list" element={<ProductTypeList/>}/>

        {/* product manufacture  */}
        <Route path="/product-manufacture-location-list" element={<ProductManufactureLocactionList/>}/>

        {/* product   */}
        <Route path="/product-list" element={<ProductList/>}/>
        <Route path="/add-product" element={<AddProduct/>}/>
        <Route path="/product-approval/:id" element={<ProductApproval/>}/>
        <Route path="/product-details/:id" element={<ProductDetails/>}/>
        <Route path="/update-product-step1/:id" element={<ProductUpdateStep1/>}/>
        <Route path="/update-product-step2/:id" element={<ProductUpdateStep2/>}/>
        <Route path="/update-product-step3/:id" element={<ProductUpdateStep3/>}/>
        <Route path="/update-product-attributes/:id" element={<ProductUpdateAttribute/>}/>
        
        {/* support */}
        <Route path="/faq-user-list" element={<UserFaq/>}/>
        <Route path="/user-terms-condition" element={<UserTermsAndCondition/>}/>
        <Route path="/driver-terms-condition" element={<DriverTermsAndCondition/>}/>
        <Route path="/vendor-terms-condition" element={<VendorTermsAndCondition/>}/>
        <Route path="/user-privacy-policy" element={<UserPrivacyPolicy/>}/>
        <Route path="/driver-privacy-policy" element={<DriverPrivacyPolicy/>}/>
        <Route path="/vendor-privacy-policy" element={<VendorPrivacyPolicy/>}/>
        <Route path="/contact-query" element={<ContactQueryList/>}/>
        
        {/* notification */}
        <Route path="/notification-list" element={<NotificationList/>}/>
        <Route path="/notify-list" element={<NotifyList/>}/>
        
        {/* command center */}
        <Route path="/role-list" element={<RoleList/>}/>
        <Route path="/permission-list" element={<PermissionList/>}/>
        <Route path="/admin-list" element={<AdminList/>}/>
        
        {/* support ticket */}
        <Route path="/user-ticket-list" element={<UserTicketList/>}/>
        <Route path="/driver-ticket-list" element={<DriverTicketList/>}/>
        <Route path="/vendor-ticket-list" element={<VendorTicketList/>}/>
        <Route path="/ticket-category-list" element={<TicketCategoryList/>}/>
        <Route path="/chat-box/:id" element={<ChatBox/>}/>

        {/* order */}
        <Route path="/order-list" element={<OrderList/>}/>
        <Route path="/order-details/:id" element={<OrderDetails/>}/>
        <Route path="/complete-order-list" element={<CompletedOrderList/>}/>
        <Route path="/cancel-order-list" element={<CancelledOrderList/>}/>
        <Route path="/track-order-list" element={<TrackOrderList/>}/>
        <Route path="/assign-driver" element={<AssignDriverOrders/>}/>
        <Route path="/order-invoice/:id" element={<OrderInvoice />} />
        <Route path="/intercity-order-list" element={<IntercityOrderList />} />


        {/* fund management */}
        <Route path="/admin-transection-history" element={<AdminTransectionHistory/>}/>
        <Route path="/vendor-withdraw" element={<VendorWithdrawList/>}/>
        <Route path="/driver-withdraw" element={<DriverWithdrawList/>}/>

        {/* user management */}
        <Route path="/user-list" element={<UserList/>}/>

        {/* location management */}
        <Route path="/zipcode-list" element={<DeliveryZipcode/>}/>
        <Route path="/operational-city-list" element={<OperationalCityList/>}/>
        <Route path="/pickup-location-list" element={<PickupLocationPage/>}/>

        {/* promo code */}
        <Route path="/coupon-list" element={<CouponList/>}/>
        <Route path="/categories/:id" element={<NLevelCategoryPage />} />
        
    </Routes>
  )
}

export default AuthenticatedRoutes