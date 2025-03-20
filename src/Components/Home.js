import React, { useState } from "react";
import { motion } from "framer-motion";
import "./../Style/CSS/Home.css"
function Home() {
    const [isOpen, setIsOpen] = useState(false);

    // Sidebar animation
    const sidebarVariants = {
      open: { x: 0, transition: { type: "spring", stiffness: 100 } },
      closed: { x: "-100%", transition: { type: "spring", stiffness: 100 } },
    };
  
    return (
      <>
        {/* Backdrop Overlay */}
        {isOpen && (
          <motion.div
            className="backdrop"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          />
        )}
  
        {/* Hide Menu Button when Sidebar is Open */}
        {!isOpen && (
          <motion.button
            className="menu-button"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span class="material-symbols-outlined">
            chevron_right
            </span>
          </motion.button>
        )}
  
        {/* Sidebar */}
        <motion.nav
          className="sidebar"
          variants={sidebarVariants}
          animate={isOpen ? "open" : "closed"}
        >
          <motion.button
            className="close-button"
            onClick={() => setIsOpen(false)}
            whileHover={{ scale: 1.2 }}
          >
            <span class="material-symbols-outlined">
            arrow_back_ios
            </span>
          </motion.button>
          <ul>
            {["Home", "About", "Services", "Contact"].map((item, i) => (
                <motion.li
                key={item}
                initial={{ opacity: 0, x: -20 }} // Start hidden & slightly left
                animate={{ opacity: 1, x: 0 }} // Fade-in & slide-in
                exit={{ opacity: 0, x: -20 }} // Exit with fade-out & slide left
                transition={{ delay: i * 0.1, duration: 0.5, type: "spring" }} // Stagger effect
                >
                <a href={`/${item.toLowerCase()}`}>{item}</a>
                </motion.li>
            ))}
            </ul>

        </motion.nav>
      </>
    );    
}

export default Home;