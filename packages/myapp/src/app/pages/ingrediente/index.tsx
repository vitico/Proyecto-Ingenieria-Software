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
    getAllIngredientes,
    getAllIngredientes_ingredientes,
} from './__generated__/getAllIngredientes';
import { SpecialTable } from '../oferta/details';
import {
    saveIngrediente,
    saveIngredienteVariables,
} from './__generated__/saveIngrediente';
import _ from 'lodash';

type DATA_TYPE = getAllIngredientes_ingredientes;
const EditContext = createContext({
    onEdit: (id: DATA_TYPE) => {},
});
const columns: ColumnsType<DATA_TYPE> = [
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
    query getAllIngredientes {
        ingredientes {
            id
            nombre
            unidades {
                idUnidad
                precio
            }
        }
    }
`;
//TODO: add unidad
const SAVE_DATA_MUTATION = gql`
    mutation saveIngrediente($id: String, $nombre: String!, $unidades: [ArgUnidades!]!) {
        saveIngrediente(id: $id, nombre: $nombre, unidades: $unidades)
    }
`;
const DELETE_DATA_MUTATION = gql`
    mutation deleteIngrediente($id: String!) {
        deleteIngrediente(id: $id)
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

const Mant = forwardRef<any, any>((props, ref) => {
    const [isOpen, setOpen] = useState(false);
    const resolve = useRef<any>();
    const [form] = Form.useForm();

    useImperativeHandle(ref, () => ({
        open: (values?: any) => {
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
                <Form.Item name={'unidades'}>
                    <SpecialTable
                        columns={[
                            {
                                title: 'unidad',
                                field: 'idUnidad',
                            },
                            {
                                title: 'precio',
                                field: 'precio',
                                type: 'numeric',
                            },
                        ]}
                        onRowAdd={() => ({ idUnidad: '1', precio: 0 })}
                        onRowUpdate={(data: any) => (data.idUnidad ? data : undefined)}
                        Title={'Unidades'}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
});

function dataToVars(data: DATA_TYPE): saveIngredienteVariables {
    return {
        nombre: data.nombre,
        unidades:
            data.unidades?.map(({ precio, ...t }: any) => {
                return {
                    ...t,
                    precio: _.toNumber(precio),
                };
            }) ?? [],
    };
}

function ConsultaIngrediente() {
    const refMant = useRef<any>();
    const [save] = useMutation<saveIngrediente, saveIngredienteVariables>(
        SAVE_DATA_MUTATION
    );

    const { loading, error, data } = useQuery<getAllIngredientes>(ALL_DATA_QUERY, {
        pollInterval: 2000,
    });
    const onAdd = useCallback(() => {
        refMant.current?.open().then((data: DATA_TYPE) => {
            if (!data) return;
            save({
                variables: {
                    ...dataToVars(data),
                },
            });
        });
    }, [save]);
    const onEditData = useCallback(
        (_data: DATA_TYPE) => {
            refMant.current?.open(_.cloneDeep(_data)).then((data: DATA_TYPE) => {
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
                dataSource={data!.ingredientes ?? []}
            />
        );

    return (
        <React.Fragment>
            <Mant ref={refMant} />
            <Card>
                <PageHeader
                    className="site-page-header"
                    title="Consulta Ingrediente"
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

export default ConsultaIngrediente;
