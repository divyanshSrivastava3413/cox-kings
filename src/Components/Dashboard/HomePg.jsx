import React from "react";
import {
  AssignmentInd,
  AccountCircle,
  AdminPanelSettings,
  Phone,
  Email,
  Badge,
  Business,
  Lightbulb,
  CalendarToday,
  Description,
  DescriptionOutlined,
} from "@mui/icons-material";

const HomePg = () => {
  const borderColor = "#005899"; // blue border and text
  const textColor = "#005899";
  const backgroundColor = "#FFFFFF"; // card + svg background
  const cards = [
    {
      id: 1,
      title: "Decision Dock",
      description: "Information Madness!",
      icon: <Lightbulb style={{ color: "#005899", fontSize: "4vw" }} />,
    },
    {
      id: 2,
      title: "Compliance Arena",
      description: "Let's Play!",
      icon: <CalendarToday style={{ color: "#005899", fontSize: "4vw" }} />,
    },
    {
      id: 3,
      title: "E-Way Bill",
      description: "Let's Clear the RoadBlocks!",
      icon: <Description style={{ color: "#005899", fontSize: "4vw" }} />,
    },
    {
      id: 4,
      title: "E-invoice",
      description: "Invoice, Click, Done!",
      icon: <DescriptionOutlined style={{ color: "#005899", fontSize: "4vw" }} />,
    },
  ]
  const handleCardClick = (id) => {
    if (id === 1 || id === 2 || id === 3) {
      // setAccessModalOpen(true)
    }
    if (id === 4) {
      // navigate("/invoice")
    }
  }

  return (
    <div className="flex flex-row h-[82vh] p-8 gap-8 w-[73vw]  ">
      {/* Left Panel */}
      <div
      className="w-full max-w-md mx-auto border-2 shadow-lg rounded-lg overflow-hidden flex flex-col gap-4"
      style={{
        borderColor,
        backgroundColor,
        boxShadow: "4px 4px 8px rgba(0, 0, 0, 1.5)"
      }}
    >
      {/* Hotel Image - Full Width with Wavy Bottom */}
      <div className="w-full relative">
        {/* <img src="/images/image.png" alt="Hotel View" className="w-full h-48 object-contain bg-gray-200" /> */}
        <div className="w-full h-48 object-cover bg-gray-200" style={{backgroundImage:`url('/image.png')`,backgroundSize:'contain',backgroundPosition:'center',backgroundRepeat:'no-repeat'}}></div>
        {/* Wavy Border at Bottom of Image */}
        <div
          className="absolute bottom-0 left-0 w-full overflow-hidden"
          style={{ height: "35px", transform: "translateY(50%)" }}
        >
          <svg viewBox="0 0 500 50" preserveAspectRatio="none" style={{ height: "100%", width: "100%" }}>
            <path
              d="M0,50 L0,20 C150,60 350,-20 500,20 L500,50 Z"
              style={{ stroke: "none", fill: backgroundColor}}
            ></path>
          </svg>
        </div>
      </div>

      {/* Text Content */}
      {/* <div className="p-6 ">
        <h2
          className="text-2xl font-bold mb-4 text-left"
          style={{ color: textColor }}
        >
          Welcome, John Doe
        </h2>

        <div className="flex flex-col space-y-3 p-6">
          <div className="flex items-center space-x-2 text-md">
            <AssignmentInd style={{ color: textColor }} />
            <span className="font-semibold" style={{ color: textColor }}>
              Bio:
            </span>
            <span className="truncate" style={{ color: textColor }}>
              Sample bio here
            </span>
          </div>

          <div className="flex items-center space-x-2 text-md">
            <AccountCircle style={{ color: textColor }} />
            <span className="font-semibold" style={{ color: textColor }}>
              Name:
            </span>
            <span className="truncate" style={{ color: textColor }}>
              John Doe
            </span>
          </div>

          <div className="flex items-center space-x-2 text-md">
            <AdminPanelSettings style={{ color: textColor }} />
            <span className="font-semibold" style={{ color: textColor }}>
              Type:
            </span>
            <span className="truncate" style={{ color: textColor }}>
              Admin
            </span>
          </div>

          <div className="flex items-center space-x-2 text-md">
            <Phone style={{ color: textColor }} />
            <span className="font-semibold" style={{ color: textColor }}>
              Phone:
            </span>
            <span className="truncate" style={{ color: textColor }}>
              +1 234 567 8901
            </span>
          </div>

          <div className="flex items-center space-x-2 text-md">
            <Email style={{ color: textColor }} />
            <span className="font-semibold" style={{ color: textColor }}>
              Email:
            </span>
            <span className="truncate" style={{ color: textColor }}>
              john@example.com
            </span>
          </div>

          <div className="flex items-center space-x-2 text-md">
            <Badge style={{ color: textColor }} />
            <span className="font-semibold" style={{ color: textColor }}>
              GSTIN:
            </span>
            <span className="truncate" style={{ color: textColor }}>
              GSTIN1234X
            </span>
          </div>

          <div className="flex items-center space-x-2 text-md">
            <Business style={{ color: textColor }} />
            <span className="font-semibold" style={{ color: textColor }}>
              Company Name:
            </span>
            <span className="truncate" style={{ color: textColor }}>
              My Company
            </span>
          </div>
        </div>
      </div> */}
      <div className="text-content flex justify-center items-center">
      <div className="flex flex-col gap-1 p-6 w-[90%]  ">
      <h2
          className="text-2xl font-bold mb-4 text-left"
          style={{ color: textColor }}
        >
          Welcome, UserName
        </h2>
  {[
    { icon: <AssignmentInd style={{ color: textColor }} />, label: "Bio", value: "Sample bio here" },
    { icon: <AccountCircle style={{ color: textColor }} />, label: "Name", value: "user" },
    { icon: <AdminPanelSettings style={{ color: textColor }} />, label: "Type", value: "Admin" },
    { icon: <Phone style={{ color: textColor }} />, label: "Phone", value: "+1 234 567 8901" },
    { icon: <Email style={{ color: textColor }} />, label: "Email", value: "test@gmail.com" },
    { icon: <Badge style={{ color: textColor }} />, label: "GSTIN", value: "GSTIN1234X" },
    { icon: <Business style={{ color: textColor }} />, label: "Company", value: "My Company" }
  ].map((item, idx) => (
    <div
      key={idx}
      className="flex items-center space-x-2 "
      style={{ display: 'flex', alignItems: 'center',justifyContent:'space-around',fontSize:'1.2vw' }}
    >
      {item.icon} &nbsp;
      <span
        className="font-semibold"
        style={{
          color: textColor,
          flexBasis: "30%", // Reserve 30% space for the label to ensure uniformity
          whiteSpace: "nowrap", // Prevent label text from wrapping
        }}
      >
        {item.label}:
      </span>
      <span
        className="truncate"
        style={{
          color: textColor,
          flexGrow: 1, // Ensure the value takes up the remaining space
          textAlign: "left", // Keep the text left-aligned within its space
        }}
      >
        {item.value}
      </span>
    </div>
  ))}
</div>
</div>

    </div>

      {/* Right Panel: Grid of 4 Cards */}
      <div className="grid grid-cols-2 gap-6 flex-1 p-1">
      {cards.map((card) => (
        <div
          key={card.id}
          className="relative flex flex-col justify-center align-center p-4 bg-white text-black rounded-lg transition duration-300 transform hover:scale-105 hover:translate-y-2 cursor-pointer"
          style={{
            backgroundColor: 'white',
            boxShadow: "4px 4px 8px rgba(0, 0, 0, 1)",
          }}
          onClick={() => handleCardClick(card.id)}
        >
          {/* Yellow Dots at top-left and top-right */}
          <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-[#005899]"></div>
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#005899]"></div>

          {/* Icon at the top */}
          <div className="flex justify-center items-center mb-4  ">{card.icon}</div>

          {/* Title */}
          <h3 className="text-xl font-bold text-center mb-2  "
          style={{
    color: "#000",
  }}>
            {card.title}
          </h3>

          {/* Description */}
          <p className="text-md font-medium text-center "style={{
    color: 'gray',
  }}>
            {card.description}
          </p>
        </div>
      ))}
    </div>
    </div>
  );
};

export default HomePg;
