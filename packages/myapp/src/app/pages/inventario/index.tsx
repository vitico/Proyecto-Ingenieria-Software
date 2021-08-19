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
import {
    getALlInventario,
    getALlInventario_inventarios,
} from './__generated__/getALlInventario';
import {
    deleteInventario,
    deleteInventarioVariables,
} from './__generated__/deleteInventario';

const EditContext = createContext({
    onEdit: (id: getALlInventario_inventarios) => {},
});
const columns: ColumnsType<getALlInventario_inventarios> = [
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
                        apolloClient.mutate<deleteInventario, deleteInventarioVariables>({
                            mutation: DELETE_DATA_MUTATION,
                            variables: {
                                id: {
                                    idIngrediente: record.idIngrediente,
                                    idUnidad: record.idUnidad,
                                    idAlmacen: record.idAlmacen,
                                },
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
    query getALlInventario {
        inventarios {
            idAlmacen
            idIngrediente
            idUnidad
            cantidad
        }
    }
`;

const SAVE_DATA_MUTATION = gql`
    mutation saveInventario(
        $idAlmacen: String!
        $idIngrediente: String!
        $idUnidad: String!
        $cantidad: Int!
    ) {
        saveInventario(
            id: {
                idAlmacen: $idAlmacen
                idIngrediente: $idIngrediente
                idUnidad: $idUnidad
            }
            cantidad: $cantidad
        )
    }
`;
const DELETE_DATA_MUTATION = gql`
    mutation deleteInventario($id: IdInventarioInput!) {
        deleteInventario(id: $id)
    }
`;

const routes = [
    {
        path: '/',
        breadcrumbName: 'Inicio',
    },
    {
        path: 'inventario',
        breadcrumbName: 'Inventario',
    },
];

const Mant = forwardRef<any, any>((props, ref) => {
    const [isOpen, setOpen] = useState(false);
    const resolve = useRef<any>();
    const [form] = Form.useForm();

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
            </Form>
        </Modal>
    );
});

function ConsultaInventario() {
    const refMant = useRef<any>();
    const [save] = useMutation(SAVE_DATA_MUTATION);

    const { loading, error, data } = useQuery<getALlInventario>(ALL_DATA_QUERY, {
        pollInterval: 2000,
    });
    const onAdd = useCallback(() => {
        refMant.current?.open().then((data: any) => {
            if (!data) return;
            save({
                variables: {
                    nombre: data.nombre,
                },
            });
        });
    }, [save]);
    const onEditData = useCallback(
        (_data: any) => {
            refMant.current?.open(_data).then((data: any) => {
                if (!data) return;
                save({
                    variables: {
                        nombre: data.nombre,
                        id: _data.id,
                    },
                });
            });
        },
        [save]
    );

    let content = <></>;
    if (error) content = <p>Error :(</p>;
    else if (loading) content = <p>Loading...</p>;
    else
        content = (
            <Table
                rowKey={(t) => `${t.idUnidad}/${t.idIngrediente}/${t.idAlmacen}`}
                columns={columns}
                dataSource={data!.inventarios ?? []}
            />
        );

    return (
        <React.Fragment>
            <Mant ref={refMant} />
            <Card>
                <PageHeader
                    className="site-page-header"
                    title="Consulta Inventario"
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

export default ConsultaInventario;
