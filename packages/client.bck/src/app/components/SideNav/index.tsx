import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';

import AppState from '../../AppState';

function handleClick(e: any) {
    console.log('click', e);
}
const { SubMenu } = Menu;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SideNav(props: unknown) {
    const toggleDrawer = (event: any) => {
        console.log('toggle drawer', event);
        AppState.toggleDrawer(event);
    };

    return (
        <Layout.Sider
            collapsible
            collapsed={AppState.sideBarCollapsed}
            onCollapse={toggleDrawer}
        >
            <Menu onClick={handleClick} mode="inline" theme="dark">
                <Menu.Item key="1" icon={<PieChartOutlined />}>
                    Option 1
                </Menu.Item>
                <Menu.Item key="2" icon={<DesktopOutlined />}>
                    Option 2
                </Menu.Item>
                <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                    <Menu.Item key="3">Tom</Menu.Item>
                    <Menu.Item key="4">Bill</Menu.Item>
                    <Menu.Item key="5">Alex</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                    <Menu.Item key="6">Team 1</Menu.Item>
                    <Menu.Item key="8">Team 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="9" icon={<FileOutlined />}>
                    Files
                </Menu.Item>
            </Menu>
        </Layout.Sider>
    );
}

export default observer(SideNav);
