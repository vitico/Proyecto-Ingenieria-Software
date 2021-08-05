import { Breadcrumb, Layout } from 'antd';
import React from 'react';

import AppState from './AppState';
import SideNav from './components/SideNav';
import MantOferta from './pages/oferta';
export default function SwipeableTemporaryDrawer() {
    const toggleDrawer = (open: boolean) => (event: any) => {
        AppState.toggleDrawer(open);
    };

    return (
        <div>
            <Layout style={{ minHeight: '100vh' }}>
                <SideNav />
                <Layout className={'site-layout'}>
                    <Layout.Header
                        className={'site-layout-background'}
                        style={{ padding: 0 }}
                    />
                    <Layout.Content style={{ margin: '16px' }}>
                        <MantOferta />
                    </Layout.Content>
                </Layout>
            </Layout>
        </div>
    );
}
