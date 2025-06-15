import React, { useState } from "react";
import { useGlobalState } from "../GlobalProvider";
import { useNavigate } from "react-router-dom";
function Sidebar({ selectedMenu, selectedItem }) {
  const navigate = useNavigate();
  const { globalState, setGlobalState } = useGlobalState();
  const [permissions, setPermissions] =useState(globalState?.user?.role?.permissions)
  const navItem = [
    {
      menuIcon: "https://cdn-icons-png.flaticon.com/128/1828/1828791.png",
      menu: "Dashboard",
      subMenu: [
        {
          name: "Dashboard",
          path: "/",
        },
      ],
    },
    {
      menuIcon: "https://cdn-icons-png.flaticon.com/128/2435/2435245.png",
      menu: "Orders",
      subMenu: [
        {
          name: "All Orders",
          path: "/order-list",
        },
        {
          name: "Assign Driver",
          path: "/assign-driver",
        },
        {
          name: "Track Orders",
          path: "/track-order-list",
        },
        {
          name: "Completed Orders",
          path: "/complete-order-list",
        },
        {
          name: "Cancelled Orders",
          path: "/cancel-order-list",
        }
      ],
    },
    {
      menuIcon: "https://cdn-icons-png.flaticon.com/128/8287/8287848.png",
      menu: "Categories",
      subMenu: [
        {
          name: "Main Categories",
          path: "/category-list",
        },
        {
          name: "Sub Categories",
          path: "/sub-category-list",
        },
      ],
    },
    {
      menuIcon: "https://cdn-icons-png.flaticon.com/128/2875/2875916.png",
      menu: "Product Management",
      subMenu: [
        {
          name: "Products",
          path: "/product-list",
        },
        {
          name: "Add Product",
          path: "/add-product",
        },
        {
          name: "Product Types",
          path: "/product-type-list",
        },
        {
          name: "Attribute Sets",
          path: "/attribute-set-list",
        },
        {
          name: "Attributes",
          path: "/attribute-list",
        },
        {
          name: "Taxes",
          path: "/tax-list",
        },
        {
          name: "Tags",
          path: "/tag-list",
        },
        {
          name: "Product Review",
          path: "/product-review-list",
        },
      ],
    },
    {
      menuIcon: "https://cdn-icons-png.flaticon.com/128/5632/5632749.png",
      menu: "Brands",
      subMenu: [
        {
          name: "Brands",
          path: "/brand-list",
        },
      ],
    },
    {
      menuIcon: "https://cdn-icons-png.flaticon.com/128/9915/9915691.png",
      menu: "Vendors",
      subMenu: [
        {
          name: "Manage Vendors",
          path: "/vendor-list",
        },
      ],
    },
    {
      menuIcon: "https://cdn-icons-png.flaticon.com/128/33/33308.png",
      menu: "User Management",
      subMenu: [
        {
          name: "Users",
          path: "/user-list",
        },
      ],
    },
    {
      menuIcon: "https://cdn-icons-png.flaticon.com/128/6020/6020135.png",
      menu: "Fund Management",
      subMenu: [
        {
          name: "Admin Transection History",
          path: "/admin-transection-history",
        },
        {
          name: "Vendor Withdraw Request",
          path: "/vendor-withdraw",
        },
        {
          name: "Driver Withdraw Request",
          path: "/driver-withdraw",
        },
        
      ],
    },
    {
      menuIcon: "https://cdn-icons-png.flaticon.com/128/535/535188.png",
      menu: "Location Management",
      subMenu: [
        {
          name: "Pickup Location",
          path: "/pickup-location-list",
        },
        {
          name: "Product Manufacture Location",
          path: "/product-manufacture-location-list",
        },
        {
          name: "Zipcodes",
          path: "/zipcode-list",
        },
      ],
    },
    {
      menuIcon: "https://cdn-icons-png.flaticon.com/128/1601/1601521.png",
      menu: "Banners",
      subMenu: [
        {
          name: "Banners",
          path: "/banner-list",
        },
      ],
    },
    {
      menuIcon: "https://cdn-icons-png.flaticon.com/128/3988/3988365.png",
      menu: "Delivery Boys",
      subMenu: [
        {
          name: "Manage Delivery Boys",
          path: "/driver-list",
        },
      ],
    },
    {
      menuIcon: "https://cdn-icons-png.flaticon.com/128/3472/3472688.png",
      menu: "Support Tickets",
      subMenu: [
        {
          name: "User Tickets",
          path: "/user-ticket-list",
        },
        {
          name: "Driver Tickets",
          path: "/driver-ticket-list",
        },
        {
          name: "Vendor Tickets",
          path: "/vendor-ticket-list",
        },
        {
          name: "Ticket Categories",
          path: "/ticket-category-list",
        },
      ],
    },
    {
      menuIcon: "https://cdn-icons-png.flaticon.com/128/59/59130.png",
      menu: "Command Center",
      subMenu: [
        {
          name: "Admins",
          path: "/admin-list",
        },
        {
          name: "Roles",
          path: "/role-list",
        },
        {
          name: "Permissions",
          path: "/permission-list",
        },
      ],
    },
    {
      menuIcon: "https://cdn-icons-png.flaticon.com/128/2840/2840215.png",
      menu: "System Support",
      subMenu: [
        {
          name: "FAQs",
          path: "/faq-user-list",
        },
        {
          name: "Terms & Condition",
          path: "/user-terms-condition",
        },
        {
          name: "Privacy Policy",
          path: "/user-privacy-policy",
        },
        {
          name: "Contact Query",
          path: "/contact-query",
        },
      ],
    },
  ];

  const [showMenu, setShowMenu] = useState(selectedMenu);
  return (
    <div
      className={`sidebarMain ${
        globalState?.showFullSidebar ? "sidebarVisible" : "sidebarHidden"
      }`}
    >
      <div className="d-flex justify-content-end">
        <img
          className="d-block d-md-none mt-3 me-4"
          style={{ height: "20px" }}
          src="https://cdn-icons-png.flaticon.com/128/753/753345.png"
          onClick={() =>
            setGlobalState({ ...globalState, showFullSidebar: false })
          }
        />
      </div>
      <div className="p-2">
        <div className="brandLogo d-flex justify-content-center align-items-center">
          <img
            className="img-fluid"
            src="/brandLogo.jpeg"
          />
         
        </div>
        <hr />
        <div className="mt-3 ">
          {navItem?.filter((v) => permissions?.includes(v.menu)).map((v, i) => {
            return (
              <div className="mb-4" onClick={() => setShowMenu(v?.menu)}>
                <div
                  className="d-flex justify-content-between align-items-center mb-3 px-2 "
                  style={{ opacity: "0.7", cursor: "pointer" }}
                >
                  <div className="menuItem d-flex align-items-center">
                    <img src={v?.menuIcon} />
                    <p className="mb-0 ms-3">{v?.menu}</p>
                  </div>
                  <img
                    className="dropIcon"
                    src="https://cdn-icons-png.flaticon.com/128/6364/6364586.png"
                  />
                </div>
                {showMenu == v?.menu && (
                  <div className=" ms-4 ">
                    {v?.subMenu?.map((v, i) => {
                      return (
                        <p
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(v?.path)}
                          className={
                            "mb-0 p-2 subMenu " +
                            (v?.name == selectedItem
                              ? " rounded  textPrimary "
                              : " ")
                          }
                        >
                          <i className="fa fa-circle" /> {v?.name}
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
