import {gql, useMutation, useQuery} from '@apollo/client';
import {Button, Card, Form, Input, Modal, PageHeader, Space, Table} from 'antd';
import type {ColumnsType} from 'antd/lib/table';
import React, {
    createContext,
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import {apolloClient} from '../../utils/Requests';
import {EditOutlined} from '@ant-design/icons';
import {getAllGrupos, getAllGrupos_grupos} from './__generated__/getAllGrupos';
import {saveGrupo, saveGrupoVariables} from './__generated__/saveGrupo';

const EditContext = createContext({
    onEdit: (id: getAllGrupos_grupos) => {
    },
});
const columns: ColumnsType<getAllGrupos_grupos> = [
    {
        title: 'Id',
        key: 'id',
        dataIndex: 'id',
        width: 120,
    },
    {
        title: 'Nombre',
        dataIndex: 'nombre',
        key: 'nombre',
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
                                id: record.id,
                            },
                        });
                    }}
                >
                    X
                </Button>
                <EditContext.Consumer>
                    {({onEdit}) => (
                        <Button onClick={() => onEdit(record)}>
                            <EditOutlined/>
                        </Button>
                    )}
                </EditContext.Consumer>
            </Space>
        ),
    },
];
const ALL_DATA_QUERY = gql`
    query getAllGrupos {
        grupos {
            id
            nombre
            idParent
        }
    }
`;

const SAVE_DATA_MUTATION = gql`
    mutation saveGrupo($id: String, $nombre: String!, $padre: String) {
        saveGrupo(id: $id, nombre: $nombre, idPadre: $padre)
    }
`;
const DELETE_DATA_MUTATION = gql`
    mutation deleteGrupo($id: String!) {
        deleteGrupo(id: $id)
    }
`;

const routes = [
    {
        path: '/',
        breadcrumbName: 'Inicio',
    },
    {
        path: 'grupos',
        breadcrumbName: 'Grupos',
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
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
    );
});

function ConsultaGrupos() {
    const refMant = useRef<any>();
    const [save] = useMutation<saveGrupo, saveGrupoVariables>(SAVE_DATA_MUTATION);

    const {loading, error, data} = useQuery<getAllGrupos>(ALL_DATA_QUERY, {
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
                rowKey={(t) => t.id}
                columns={columns}
                dataSource={data!.grupos ?? []}
                pagination={false}
            />
        );

    return (
        <React.Fragment>
            <Mant ref={refMant}/>
            <Card>
                <PageHeader
                    className="site-page-header"
                    title="Consulta Grupos"
                    breadcrumb={{routes}}
                    extra={[
                        <Button key="3" onClick={onAdd}>
                            +
                        </Button>,
                    ]}
                />
            </Card>
            <Card>
                <EditContext.Provider value={{onEdit: onEditData}}>
                    {content}
                </EditContext.Provider>
            </Card>
        </React.Fragment>
    );
}

export default ConsultaGrupos;
