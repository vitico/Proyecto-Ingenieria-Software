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
import { saveUser, saveUserVariables } from './__generated__/saveUser';
import { getAllUsuarios, getAllUsuarios_users } from './__generated__/getAllUsuarios';

const EditContext = createContext({
    onEdit: (id: getAllUsuarios_users) => {},
});
const columns: ColumnsType<getAllUsuarios_users> = [
    {
        title: 'Id',
        key: 'id',
        dataIndex: 'id',
        width: 350,
    },
    {
        title: 'Nombre',
        dataIndex: 'username',
        key: 'username',
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
    query getAllUsuarios {
        users {
            id
            username
            password
        }
    }
`;

const SAVE_DATA_MUTATION = gql`
    mutation saveUser($id: String, $nombre: String!, $pass: String!) {
        saveUser(id: $id, nombre: $nombre, pass: $pass)
    }
`;
const DELETE_DATA_MUTATION = gql`
    mutation deleteUser($id: String!) {
        deleteUser(id: $id)
    }
`;

const routes = [
    {
        path: '/',
        breadcrumbName: 'Inicio',
    },
    {
        path: 'users',
        breadcrumbName: 'Usuarios',
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
                <Form.Item name={'username'} label={'nombre'}>
                    <Input />
                </Form.Item>
                <Form.Item name={'password'} label={'Contrasena'}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
});

function ConsultaUsuarios() {
    const refMant = useRef<any>();
    const [save] = useMutation<saveUser, saveUserVariables>(SAVE_DATA_MUTATION);

    const { loading, error, data } = useQuery<getAllUsuarios>(ALL_DATA_QUERY, {
        pollInterval: 2000,
    });
    const onAdd = useCallback(() => {
        refMant.current?.open().then((data: any) => {
            if (!data) return;
            let params = {
                nombre: data.username,
                pass: data.password,
            };
            console.log('data', { params });
            save({
                variables: params,
            });
        });
    }, [save]);
    const onEditData = useCallback(
        (_data: any) => {
            refMant.current?.open(_data).then((data: any) => {
                if (!data) return;
                let params = {
                    nombre: data.username,
                    pass: data.password,
                    id: _data.id,
                };
                console.log('data', { params });
                save({
                    variables: params,
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
                dataSource={data!.users ?? []}
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

export default ConsultaUsuarios;
