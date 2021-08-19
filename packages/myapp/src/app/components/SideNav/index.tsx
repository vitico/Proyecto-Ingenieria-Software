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
import type { MenuInfo } from 'rc-menu/lib/interface';
import { useHistory } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SideNav(props: unknown) {
    const history = useHistory();
    const toggleDrawer = (event: any) => {
        console.log('toggle drawer', event);
        AppState.toggleDrawer(event);
    };

    function handleClick(e: MenuInfo) {
        console.log('click', e);
        history.push(`/${e.key}`);
    }

    return (
        <Layout.Sider
            collapsible
            collapsed={AppState.sideBarCollapsed}
            onCollapse={toggleDrawer}
        >
            <Menu onClick={handleClick} mode="inline" theme="dark">
                <Menu.Item key="clientes" icon={<PieChartOutlined />}>
                    Cliente
                </Menu.Item>
                <Menu.Item key="facturas" icon={<DesktopOutlined />}>
                    Factura
                </Menu.Item>
                <Menu.Item key="grupos" icon={<DesktopOutlined />}>
                    Grupo
                </Menu.Item>
                <Menu.Item key="ingredientes" icon={<DesktopOutlined />}>
                    Ingrediente
                </Menu.Item>
                <Menu.Item key="inventario" icon={<DesktopOutlined />}>
                    Inventario
                </Menu.Item>
                <Menu.Item key="ofertas" icon={<DesktopOutlined />}>
                    Oferta
                </Menu.Item>

                <Menu.Item key="productos" icon={<DesktopOutlined />}>
                    Producto
                </Menu.Item>
                <Menu.Item key="unidades" icon={<DesktopOutlined />}>
                    Unidad
                </Menu.Item>
                <Menu.Item key="usuarios" icon={<DesktopOutlined />}>
                    Usuario
                </Menu.Item>
            </Menu>
        </Layout.Sider>
    );
}

export default observer(SideNav);
