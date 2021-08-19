import { gql, useMutation, useQuery } from '@apollo/client';
import { Button, Card, Form, Input, Modal, PageHeader, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import React, {
    createContext,
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { apolloClient } from '../../utils/Requests';
import { EditOutlined } from '@ant-design/icons';
import { saveCliente, saveClienteVariables } from './__generated__/saveCliente';
import {
    getAllClientes,
    getAllClientes_clientes_items,
} from './__generated__/getAllClientes';

import { Tabs } from 'antd';
import { SpecialTable } from '../oferta/details';
import { GustoType } from '../../../../__generated__/globalTypes';
import Swal from 'sweetalert2';
import _ from 'lodash';

const { TabPane } = Tabs;
const EditContext = createContext({
    onEdit: (id: getAllClientes_clientes_items) => {},
});
const columns: ColumnsType<getAllClientes_clientes_items> = [
    {
        title: 'Id',
        key: 'id',
        dataIndex: 'id',
    },
    {
        title: 'Nombre',
        dataIndex: 'nombre',
        key: 'nombre',
    },
    {
        title: 'Apellido',
        dataIndex: 'apellido',
        key: 'apellido',
    },
    {
        title: 'Action',
        key: 'action',
        width: 120,
        render: (_text, record) => (
            <Space size="middle">
                <Button
                    onClick={(_t) => {
                        apolloClient.mutate({
                            mutation: DELETE_DATA_MUTATION,
                            variables: {
                                id: _.toString(record.id),
                            },
                        });
                    }}
                >
                    X
                </Button>
                <EditContext.Consumer>
                    {({ onEdit }) => (
                        <Button onClick={() => onEdit(record)}>
                            <EditOutlined />
                        </Button>
                    )}
                </EditContext.Consumer>
            </Space>
        ),
    },
];
const ALL_DATA_QUERY = gql`
    query getAllClientes {
        clientes {
            items {
                id
                nombre
                apellido
                identificacion
                correos {
                    correo
                }
                gustos {
                    idGrupo
                    idIngrediente
                    idProducto
                    rechazar
                }
            }
        }
    }
`;

const SAVE_DATA_MUTATION = gql`
    mutation saveCliente(
        $id: String
        $nombre: String!
        $correos: [String!]!
        $identificacion: String!
        $apellido: String!
        $gustos: [GustoArg!]!
    ) {
        saveCliente(
            id: $id
            nombre: $nombre
            correos: $correos
            identificacion: $identificacion
            apellido: $apellido
            gustos: $gustos
        )
    }
`;
const DELETE_DATA_MUTATION = gql`
    mutation deleteCliente($id: String!) {
        deleteCliente(id: $id)
    }
`;

const routes = [
    {
        path: '/',
        breadcrumbName: 'Inicio',
    },
    {
        path: 'clientes',
        breadcrumbName: 'Clientes',
    },
];

const Mant = forwardRef<any, any>((props, ref) => {
    const [isOpen, setOpen] = useState(false);
    const resolve = useRef<any>();
    const [form] = Form.useForm<getAllClientes_clientes_items>();

    useImperativeHandle(ref, () => ({
        open: (values: any) => {
            setOpen(true);
            form.resetFields();
            if (values) form.setFieldsValue(values);
            return new Promise((_resolve) => {
                resolve.current = _resolve;
            }).then((resp) => {
                setOpen(false);
                return resp;
            });
        },
    }));

    return (
        <Modal
            title="Mantenimiento"
            visible={isOpen}
            onOk={() => {
                form.submit();
            }}
            onCancel={() => {
                form.resetFields();
                resolve.current();
            }}
        >
            <Form form={form} onFinish={(data) => resolve.current(data)}>
                <Form.Item name={'nombre'} label={'nombre'}>
                    <Input />
                </Form.Item>
                <Form.Item name={'apellido'} label={'apellido'}>
                    <Input />
                </Form.Item>
                <Form.Item name={'identificacion'} label={'identificacion'}>
                    <Input />
                </Form.Item>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Correos" key="1">
                        <Form.Item name={'correos'}>
                            <SpecialTable
                                columns={[
                                    {
                                        title: 'Correo',
                                        field: 'correo',
                                    },
                                ]}
                                onRowAdd={() => ({ correo: '' })}
                                onRowUpdate={(data: any) =>
                                    data.correo ? data : undefined
                                }
                                Title={'Correos'}
                            />
                        </Form.Item>
                    </TabPane>
                    <TabPane tab="Gustos" key="2">
                        <Form.Item name={'gustos'}>
                            <SpecialTable
                                columns={[
                                    {
                                        title: 'id',
                                        field: 'id',
                                        render: (data: any) =>
                                            data.idProducto ??
                                            data.idGrupo ??
                                            data.idIngrediente,
                                    },
                                    {
                                        title: 'tipo',
                                        field: 'tipo',
                                        editable: 'never',
                                        render: (data: any) =>
                                            data.idProducto
                                                ? 'producto'
                                                : data.idGrupo
                                                ? 'grupo'
                                                : 'ingrediente',
                                    },
                                    {
                                        title: 'rechazar',
                                        field: 'rechazar',
                                        type: 'boolean',
                                    },
                                ]}
                                onRowAdd={async () => {
                                    const { value } = await Swal.fire({
                                        title: 'De que tipo sera el gusto?',
                                        input: 'select',
                                        inputOptions: {
                                            idProducto: 'Producto',
                                            idGrupo: 'Grupo',
                                            idIngrediente: 'Ingrediente',
                                        },
                                        inputPlaceholder: 'Seleccione un tipo',
                                        showCancelButton: true,
                                        inputValidator: (value) => {
                                            return new Promise<string | null>(
                                                (resolve) => {
                                                    if (value) {
                                                        resolve(null);
                                                    } else {
                                                        resolve(
                                                            'Debes seleccionar un valor'
                                                        );
                                                    }
                                                }
                                            );
                                        },
                                    });
                                    if (value)
                                        return {
                                            [value]: '1',
                                            rechazar: false,
                                        };
                                }}
                                onRowUpdate={(data: any) => {
                                    if (!data.id) return data;
                                    let prop = data.idProducto
                                        ? 'idProducto'
                                        : data.idGrupo
                                        ? 'idGrupo'
                                        : 'idIngrediente';
                                    return {
                                        ...data,
                                        [prop]: data.id,
                                    };
                                }}
                                Title={'Gustos'}
                            />
                        </Form.Item>{' '}
                    </TabPane>
                </Tabs>
            </Form>
        </Modal>
    );
});

function clientDataToVars(data: getAllClientes_clientes_items) {
    return {
        identificacion: data.identificacion,
        apellido: data.apellido,
        correos: data.correos?.map((t) => t.correo) ?? [],
        gustos:
            data.gustos?.map((t) => {
                let prop: keyof typeof t = t.idProducto
                    ? 'idProducto'
                    : t.idGrupo
                    ? 'idGrupo'
                    : 'idIngrediente';
                return {
                    id: t[prop]!,
                    tipo: (prop === 'idProducto'
                        ? 'producto'
                        : prop === 'idGrupo'
                        ? 'grupo'
                        : 'ingrediente') as GustoType,
                    rechazar: t.rechazar,
                };
            }) ?? [],
        nombre: data.nombre,
    };
}

function ConsultaClientes() {
    const refMant = useRef<any>();
    const [save] = useMutation<saveCliente, saveClienteVariables>(SAVE_DATA_MUTATION);

    const { loading, error, data } = useQuery<getAllClientes>(ALL_DATA_QUERY, {
        pollInterval: 2000,
    });
    const onAdd = useCallback(() => {
        refMant.current?.open().then((data: any) => {
            if (!data) return;
            save({
                variables: {
                    ...clientDataToVars(data),
                },
            });
        });
    }, [save]);
    const onEditData = useCallback(
        (_data: any) => {
            refMant.current
                ?.open(_.cloneDeep(_data))
                .then((data: getAllClientes_clientes_items) => {
                    if (!data) return;
                    save({
                        variables: {
                            ...clientDataToVars(data),
                            id: _data.id + '',
                        },
                    });
                });
        },
        [save]
    );

    let content: JSX.Element;
    if (error) content = <p>Error :(</p>;
    else if (loading) content = <p>Loading...</p>;
    else
        content = (
            <Table
                rowKey={(t) => t.id}
                columns={columns}
                dataSource={data!.clientes.items ?? []}
            />
        );

    return (
        <React.Fragment>
            <Mant ref={refMant} />
            <Card>
                <PageHeader
                    className="site-page-header"
                    title="Consulta Clientes"
                    breadcrumb={{ routes }}
                    extra={<Button onClick={onAdd}>+</Button>}
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

export default ConsultaClientes;
