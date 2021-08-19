import { gql, useMutation, useQuery } from '@apollo/client';
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Checkbox,
    InputNumber,
    Modal,
    PageHeader,
    Row,
    Space,
    Table,
    Tabs,
} from 'antd';
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
import {
    getAllProductos,
    getAllProductos_productos,
} from './__generated__/getAllProductos';
import { saveProducto, saveProductoVariables } from './__generated__/saveProducto';
import { SpecialTable } from '../oferta/details';
import { saveIngredienteVariables } from '../ingrediente/__generated__/saveIngrediente';
import _ from 'lodash';

const EditContext = createContext({
    onEdit: (id: getAllProductos_productos) => {},
});
const columns: ColumnsType<getAllProductos_productos> = [
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
        title: 'Action',
        key: 'action',
        render: (_text, record) => (
            <Space size="middle">
                <Button
                    onClick={(_t) => {
                        apolloClient.mutate({
                            mutation: DELETE_DATA_MUTATION,
                            variables: {
                                id: record.id,
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
    query getAllProductos {
        productos {
            id
            nombre
            aceptaCompana
            esCompania
            precio
            grupos {
                id
                nombre
            }
            ingredientes {
                idIngrediente
                idUnidad
            }
        }
    }
`;

const SAVE_DATA_MUTATION = gql`
    mutation saveProducto(
        $id: String
        $nombre: String!
        $aceptaCompana: Boolean!
        $esCompania: Boolean!
        $precio: Float!
        $ingredientes: [IdIngredienteUnidad!]
        $grupos: [String!]
    ) {
        saveProducto(
            id: $id
            nombre: $nombre
            aceptaCompana: $aceptaCompana
            precio: $precio
            esCompania: $esCompania
            ingredientes: $ingredientes
            grupos: $grupos
        )
    }
`;
const DELETE_DATA_MUTATION = gql`
    mutation deleteProducto($id: String!) {
        deleteProducto(id: $id)
    }
`;

const routes = [
    {
        path: '/',
        breadcrumbName: 'Inicio',
    },
    {
        path: 'productos',
        breadcrumbName: 'Productos',
    },
];

const Mant = forwardRef<any, any>((props, ref) => {
    const [isOpen, setOpen] = useState(false);
    const resolve = useRef<any>();
    const [form] = Form.useForm<getAllProductos_productos>();

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
            <Form
                initialValues={{
                    ingredientes: [],
                }}
                form={form}
                onFinish={(data) => resolve.current(data)}
            >
                <Form.Item name={'nombre'} label={'nombre'}>
                    <Input />
                </Form.Item>
                <Form.Item name={'precio'} label={'precio'}>
                    <InputNumber />
                </Form.Item>
                <Row>
                    <Col>
                        <Form.Item
                            valuePropName={'checked'}
                            name={'esCompania'}
                            label={'es compania'}
                        >
                            <Checkbox />
                        </Form.Item>
                        <Form.Item
                            valuePropName={'checked'}
                            name={'aceptaCompania'}
                            label={'acepta compania'}
                        >
                            <Checkbox />
                        </Form.Item>
                    </Col>
                </Row>
                <Tabs>
                    <Tabs.TabPane tab={'ingredientes'} key={'1'}>
                        <Form.Item name={'ingredientes'}>
                            <SpecialTable
                                columns={[
                                    {
                                        title: 'Unidad',
                                        field: 'idUnidad',
                                    },
                                    {
                                        title: 'Ingrediente',
                                        field: 'idIngrediente',
                                    },
                                ]}
                                onRowAdd={() => ({ idUnidad: '1', idIngrediente: '1' })}
                                onRowUpdate={(data: any) =>
                                    data.idUnidad && data.idIngrediente ? data : undefined
                                }
                                Title={'Ingredientes'}
                            />
                        </Form.Item>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={'grupos'} key={'2'}>
                        <Form.Item name={'grupos'}>
                            <SpecialTable
                                columns={[
                                    {
                                        title: 'grupo',
                                        field: 'id',
                                    },
                                ]}
                                onRowAdd={() => ({ id: '1' })}
                                onRowUpdate={(data: any) => (data.id ? data : undefined)}
                                Title={'grupos'}
                            />
                        </Form.Item>
                    </Tabs.TabPane>
                </Tabs>
            </Form>
        </Modal>
    );
});

function dataToVars(data: getAllProductos_productos): saveProductoVariables {
    return {
        nombre: data.nombre,
        aceptaCompana: !!data.aceptaCompana,
        esCompania: data.esCompania,
        precio: data.precio,
        grupos: data.grupos.map((t) => t.id),
        ingredientes:
            data.ingredientes?.map(({ idIngrediente, idUnidad }) => {
                return {
                    ingrediente: idIngrediente,
                    unidad: idUnidad,
                };
            }) ?? [],
    };
}

function ConsultaProductos() {
    const refMant = useRef<any>();
    const [save] = useMutation<saveProducto, saveProductoVariables>(SAVE_DATA_MUTATION);

    const { loading, error, data } = useQuery<getAllProductos>(ALL_DATA_QUERY, {
        pollInterval: 2000,
    });
    const onAdd = useCallback(() => {
        refMant.current?.open().then((data: getAllProductos_productos) => {
            if (!data) return;
            save({
                variables: {
                    ...dataToVars(data),
                },
            });
        });
    }, [save]);
    const onEditData = useCallback(
        (_data: any) => {
            refMant.current
                ?.open(_.cloneDeep(_data))
                .then((data: getAllProductos_productos) => {
                    if (!data) return;
                    save({
                        variables: {
                            id: _data.id,
                            ...dataToVars(data),
                        },
                    });
                });
        },
        [save]
    );
    console.log('data', { data });
    let content = <></>;
    if (error) content = <p>Error :(</p>;
    else if (loading) content = <p>Loading...</p>;
    else
        content = (
            <Table
                rowKey={(t) => t.id}
                columns={columns}
                dataSource={data!.productos ?? []}
            />
        );

    return (
        <React.Fragment>
            <Mant ref={refMant} />
            <Card>
                <PageHeader
                    title="Consulta Productos"
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

export default ConsultaProductos;
