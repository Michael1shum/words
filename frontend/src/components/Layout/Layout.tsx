import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Layout as AntLayout, Button, Menu, Dropdown } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined, DownOutlined } from "@ant-design/icons";
import axios from "axios";
import styles from "./Layout.module.scss";

const { Header, Sider, Content, Footer } = AntLayout;

export const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [tests, setTests] = useState([]);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const getTests = async () => {
    try {
      const response = await axios.get("/api/tests");
      setTests(response.data);
      console.log("Tests fetched:", response.data);
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  const addTest = async () => {
    try {
      await axios.post("/api/tests/add", {
        name: "New Test",
        questions: [
          {
            description: "Choose an option",
            controlType: "checkbox",
            options: ["Option 1", "Option 2", "Option 3"],
            answer: "Option 1",
          },
        ],
      });
      await getTests();
    } catch (error) {
      console.error("Error adding test:", error);
    }
  };

  const dropdownItems = [
    {
      key: "1",
      label: (
        <Button type="link" onClick={getTests} className={styles.dropdownButton}>
          Get Tests
        </Button>
      ),
    },
    {
      key: "2",
      label: (
        <Button type="link" onClick={addTest} className={styles.dropdownButton}>
          Add Test
        </Button>
      ),
    },
  ];

  return (
    <AntLayout>
      {/* Header */}
      <Header className={styles.header}>
        <Link to="/login" className={styles.headerButton}>
          Login
        </Link>
      </Header>

      <AntLayout>
        {/* Sidebar */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={handleCollapse}
          trigger={null}
          className={styles.sider}
        >
          <div className={styles.siderTrigger}>
            {collapsed ? (
              <MenuUnfoldOutlined onClick={handleCollapse} />
            ) : (
              <MenuFoldOutlined onClick={handleCollapse} />
            )}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            items={[
              {
                key: "1",
                label: (
                  <Dropdown
                    menu={{
                      items: dropdownItems,
                    }}
                    trigger={["click"]}
                  >
                    <span className={styles.dropdownLink}>
                      Tests <DownOutlined />
                    </span>
                  </Dropdown>
                ),
              },
            ]}
          />
        </Sider>

        {/* Main content */}
        <AntLayout>
          <Content className={styles.content}>
            <Outlet context={{ tests }} />
          </Content>
          <Footer className={styles.footer}>© 2024 My Application</Footer>
        </AntLayout>
      </AntLayout>
    </AntLayout>
  );
};
