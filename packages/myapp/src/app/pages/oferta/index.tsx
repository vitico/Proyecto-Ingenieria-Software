import { gql, useQuery } from '@apollo/client';
import { Button, Card, Checkbox, PageHeader, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React, { createContext, useCallback } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import type { getAllOfertas, getAllOfertas_ofertas } from './__generated__/getAllOfertas';
import MantOferta from './details';
import Swal from 'sweetalert2';
import { apolloClient } from '../../utils/Requests';
import {
    clientesInteresados,
    clientesInteresadosVariables,
} from './__generated__/clientesInteresados';
import withReactContent from 'sweetalert2-react-content';
import _ from 'lodash';
import { getAllClientes_clientes_items } from '../cliente/__generated__/getAllClientes';
import { EditOutlined } from '@ant-design/icons';

const MySwal = withReactContent(Swal);
const EditContext = createContext({
    onEdit: (id: getAllOfertas_ofertas) => {},
});
const columns: ColumnsType<getAllOfertas_ofertas> = [
    {
        title: 'fecha inicial',
        key: 'fechaInicial',
        dataIndex: 'fechaInicial',
        render: (_text) => moment(_text).format('YYYY/MM/DD'),
    },
    {
        title: 'fecha final',
        dataIndex: 'fechaFinal',
        key: 'fechaFinal',
        render: (_text) => moment(_text).format('YYYY/MM/DD'),
    },
    {
        title: 'Activo',
        dataIndex: 'activo',
        key: 'activo',
        render: (text) => <Checkbox checked={text} />,
    },
    {
        title: 'Action',
        key: 'action',
        width: 160,
        render: (_text, record) => (
            <Space size="middle">
                <Button onClick={(_t) => console.log(record)}>X</Button>
                <EditContext.Consumer>
                    {({ onEdit }) => (
                        <Button onClick={() => onEdit(record)}>
                            <EditOutlined />
                        </Button>
                    )}
                </EditContext.Consumer>
                <Button
                    onClick={async () => {
                        // Sw

                        let { value, isConfirmed } = await Swal.fire({
                            title: 'En base a cuantas facturas desea generar las notificaciones?',
                            input: 'number',
                            inputLabel: 'valor por defecto: 10',
                            showCancelButton: true,
                        });
                        if (!isConfirmed) {
                            return;
                        }
                        value = value ?? 10;
                        let variables = {
                            oferta: record.id,
                            cantidad: +value,
                        };
                        console.log('variables', { variables });
                        let {
                            data: { clientesOferta },
                        } = await apolloClient.query<
                            clientesInteresados,
                            clientesInteresadosVariables
                        >({
                            query: gql`
                                query clientesInteresados(
                                    $oferta: String!
                                    $cantidad: Int!
                                ) {
                                    clientesOferta(
                                        oferta: $oferta
                                        cantidadFacturas: $cantidad
                                    ) {
                                        id
                                        nombre
                                        apellido
                                        identificacion
                                        correos {
                                            correo
                                        }
                                    }
                                }
                            `,
                            variables: {
                                oferta: record.id,
                                cantidad: +value,
                            },
                        });
                        const clientes = clientesOferta || [];
                        console.log('clientes', { clientes });

                        let resp = await MySwal.fire({
                            title: 'A estos clientes les puede interesar esta oferta:',
                            html: (
                                <>
                                    <Table
                                        rowKey={(t) => t.id}
                                        columns={[
                                            {
                                                title: 'nombre',
                                                key: 'nombre',
                                                dataIndex: 'nombre',
                                            },
                                            {
                                                title: 'apellido',
                                                key: 'apellido',
                                                dataIndex: 'apellido',
                                            },
                                            {
                                                title: 'identificacion',
                                                key: 'identificacion',
                                                dataIndex: 'identificacion',
                                            },
                                        ]}
                                        expandedRowRender={(data) => (
                                            <Table
                                                columns={[
                                                    {
                                                        title: 'correo',
                                                        key: 'correo',
                                                        dataIndex: 'correo',
                                                    },
                                                ]}
                                                dataSource={data!.correos!}
                                            />
                                        )}
                                        dataSource={clientes}
                                    />
                                </>
                            ),
                            confirmButtonText: 'Copiar correos',
                            showCancelButton: true,
                        });
                        if (resp.isConfirmed) {
                            let result = _.flatten(
                                clientes.map((t) => t.correos!.map((t) => t.correo))
                            );
                            console.log('result', {
                                result,
                                text: result.join(','),
                            });
                            navigator.clipboard.writeText(result.join(','));
                            // copy()
                        }
                    }}
                >
                    Generar Notificacion
                </Button>
            </Space>
        ),
    },
];
const ALL_OFERTAS_QUERY = gql`
    query getAllOfertas {
        ofertas {
            id
            fechaInicial
            fechaFinal
            activo
        }
    }
`;

const routes = [
    {
        path: '/',
        breadcrumbName: 'Inicio',
    },
    {
        path: 'ofertas',
        breadcrumbName: 'Ofertas',
    },
];

function ConsultaOferta() {
    const match = useRouteMatch();
    const history = useHistory();

    const { loading, error, data } = useQuery<getAllOfertas>(ALL_OFERTAS_QUERY, {
        pollInterval: 2000,
    });
    const onAddOferta = useCallback(() => {
        history.push(`${match.path}/detalles`);
    }, [history, match.path]);
    const onEditData = useCallback(
        (data: getAllOfertas_ofertas) => {
            history.push(`${match.path}/detalles/${data.id}`);
        },
        [history, match.path]
    );

    let content = <></>;
    if (error) content = <p>Error :(</p>;
    else if (loading) content = <p>Loading...</p>;
    else
        content = (
            <Table
                rowKey={(t) => t.id}
                columns={columns}
                dataSource={data!.ofertas ?? []}
            />
        );

    return (
        <React.Fragment>
            <Card>
                <PageHeader
                    className="site-page-header"
                    title="Consulta Oferta"
                    breadcrumb={{ routes }}
                    extra={[
                        <Button key="3" onClick={onAddOferta}>
                            +
                        </Button>,
                    ]}
                />
            </Card>
            <Card>
                <EditContext.Provider value={{ onEdit: onEditData }}>
                    {content}
                </EditContext.Provider>
            </Card>
        </React.Fragment>
    );
}

function OfertasContainer() {
    const match = useRouteMatch();
    return (
        <Switch>
            <Route path={`${match.path}/detalles/:id?`}>
                <MantOferta />
            </Route>
            <Route path={`${match.path}`}>
                <ConsultaOferta />
            </Route>
        </Switch>
    );
}

export default OfertasContainer;
