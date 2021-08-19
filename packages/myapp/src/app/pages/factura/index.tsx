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
import { getAllFacturas, getAllFacturas_facturas } from './__generated__/getAllFacturas';
import { deleteFactura, deleteFacturaVariables } from './__generated__/deleteFactura';
import { saveFactura, saveFacturaVariables } from './__generated__/saveFactura';
import _ from 'lodash';

const EditContext = createContext({
    onEdit: (id: getAllFacturas_facturas) => {},
});
const columns: ColumnsType<getAllFacturas_facturas> = [
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
                        apolloClient.mutate<deleteFactura, deleteFacturaVariables>({
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
    query getAllFacturas {
        facturas {
            id
            fecha
            idCliente
            detalles {
                cantidad
                idProducto
                importe
                itbis
                precio
            }
        }
    }
`;

const SAVE_DATA_MUTATION = gql`
    mutation saveFactura(
        $id: String
        $cliente: String!
        $fecha: DateTime!
        $detalles: [ArgDetalleFactura!]!
    ) {
        saveFactura(id: $id, fecha: $fecha, cliente: $cliente, detalles: $detalles)
    }
`;
const DELETE_DATA_MUTATION = gql`
    mutation deleteFactura($id: String!) {
        deleteFactura(id: $id)
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

function dataToVars(data: getAllFacturas_facturas): saveFacturaVariables {
    return {
        fecha: data.fecha,
        detalles: data.detalles.map((t) => ({
            producto: t.idProducto,
            precio: t.precio,
            cantidad: t.cantidad,
            itbis: t.itbis,
            importe: t.importe,
        })),
        cliente: data.idCliente,
    };
}

function ConsultaFacturas() {
    const refMant = useRef<any>();
    const [save] = useMutation<saveFactura, saveFacturaVariables>(SAVE_DATA_MUTATION);

    const { loading, error, data } = useQuery<getAllFacturas>(ALL_DATA_QUERY, {
        pollInterval: 2000,
    });
    const onAdd = useCallback(() => {
        refMant.current?.open().then((data: getAllFacturas_facturas) => {
            if (!data) return;
            save({
                variables: {
                    ...dataToVars(data),
                },
            });
        });
    }, [save]);
    const onEditData = useCallback(
        (_data: getAllFacturas_facturas) => {
            refMant.current
                ?.open(_.cloneDeep(_data))
                .then((data: getAllFacturas_facturas) => {
                    if (!data) return;
                    save({
                        variables: {
                            ...dataToVars(data),
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
                rowKey={(t) => t.id}
                columns={columns}
                dataSource={data!.facturas ?? []}
            />
        );

    return (
        <React.Fragment>
            <Mant ref={refMant} />
            <Card>
                <PageHeader
                    className="site-page-header"
                    title="Consulta Oferta"
                    breadcrumb={{ routes }}
                    extra={[
                        <Button key="3" onClick={onAdd}>
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

export default ConsultaFacturas;
