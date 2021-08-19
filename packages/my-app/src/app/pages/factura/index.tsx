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
import { getAllUnidades, getAllUnidades_unidades } from './__generated__/getAllUnidades';
import { apolloClient } from '../../utils/Requests';
import { EditOutlined } from '@ant-design/icons';

const EditContext = createContext({
    onEdit: (id: string) => {},
});
const columns: ColumnsType<getAllUnidades_unidades> = [
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
                            mutation: gql`
                                mutation deleteUnidad($id: String!) {
                                    deleteUnidad(id: $id)
                                }
                            `,
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
                        <Button onClick={() => onEdit(record.id)}>
                            <EditOutlined />
                        </Button>
                    )}
                </EditContext.Consumer>
            </Space>
        ),
    },
];
const ALL_UNIDADES_QUERY = gql`
    query getAllUnidades {
        unidades {
            id
            nombre
        }
    }
`;

const ADD_UNIDAD_MUTATION = gql`
    mutation addUnidad($id: String, $nombre: String!) {
        saveUnidad(id: $id, nombre: $nombre)
    }
`;

const routes = [
    {
        path: '/',
        breadcrumbName: 'Inicio',
    },
    {
        path: 'ofertas',
        breadcrumbName: 'Unidades',
    },
];

const MantUnidad = forwardRef<any, any>((props, ref) => {
    const [isOpen, setOpen] = useState(false);
    const resolve = useRef<any>();
    const [form] = Form.useForm();

    useImperativeHandle(ref, () => ({
        open: () => {
            setOpen(true);
            form.resetFields();
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
            title="Basic Modal"
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

function ConsultaUnidad() {
    const refMant = useRef<any>();
    const [save] = useMutation(ADD_UNIDAD_MUTATION);

    const { loading, error, data } = useQuery<getAllUnidades>(ALL_UNIDADES_QUERY, {
        pollInterval: 2000,
    });
    const onAddOferta = useCallback(() => {
        refMant.current?.open().then((data: any) => {
            if (!data) return;
            save({
                variables: {
                    nombre: data.nombre,
                },
            });
        });
    }, [save]);
    const onEditData = useCallback((id: string) => {
        refMant.current?.open().then((data: any) => {
            if (!data) return;
            save({
                variables: {
                    nombre: data.nombre,
                    id: id
                },
            });
        });
    }, [save]);

    let content = <></>;
    if (error) content = <p>Error :(</p>;
    else if (loading) content = <p>Loading...</p>;
    else
        content = (
            <Table
                rowKey={(t) => t.id}
                columns={columns}
                dataSource={data!.unidades ?? []}
            />
        );

    return (
        <React.Fragment>
            <MantUnidad ref={refMant} />
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

export default ConsultaUnidad;
