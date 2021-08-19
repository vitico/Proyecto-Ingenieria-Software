import { ApolloProvider } from '@apollo/client';
import { Layout } from 'antd';
import React from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import AppState from './AppState';
import SideNav from './components/SideNav';
import MantOferta from './pages/oferta';
import { apolloClient } from './utils/Requests';
import ConsultaUnidad from './pages/unidad';
import ConsultaGrupos from './pages/grupo';
import ConsultaUsuarios from './pages/usuario';
import ConsultaClientes from './pages/cliente';
import ConsultaIngrediente from './pages/ingrediente';
import ConsultaProductos from './pages/producto';

export default function SwipeableTemporaryDrawer() {
    const toggleDrawer = (open: boolean) => (event: any) => {
        AppState.toggleDrawer(open);
    };

    return (
        <ApolloProvider client={apolloClient}>
            <Router>
                <div>
                    <Layout style={{ minHeight: '100vh' }}>
                        <SideNav />
                        <Layout className={'site-layout'}>
                            <Layout.Header
                                className={'site-layout-background'}
                                style={{ padding: 0 }}
                            />
                            <Layout.Content style={{ margin: '16px' }}>
                                <Switch>
                                    <Route path={'/ofertas'}>
                                        <MantOferta />
                                    </Route>
                                    <Route path={'/unidades'}>
                                        <ConsultaUnidad />
                                    </Route>
                                    <Route path={'/grupos'}>
                                        <ConsultaGrupos />
                                    </Route>
                                    <Route path={'/clientes'}>
                                        <ConsultaClientes />
                                    </Route>

                                    <Route path={'/ingredientes'}>
                                        <ConsultaIngrediente />
                                    </Route>
                                    <Route path={'/productos'}>
                                        <ConsultaProductos />
                                    </Route>

                                    <Route path={'/inventario'}>
                                        <ConsultaProductos />
                                    </Route>

                                    <Route path={'/users'}>
                                        <ConsultaUsuarios />
                                    </Route>
                                    <Route path={'/'} exact={true}>
                                        <Redirect to={'ofertas'} />
                                    </Route>
                                </Switch>
                            </Layout.Content>
                        </Layout>
                    </Layout>
                </div>
            </Router>
        </ApolloProvider>
    );
}
