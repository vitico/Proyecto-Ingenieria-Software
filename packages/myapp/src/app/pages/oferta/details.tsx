import { gql, useQuery } from '@apollo/client';
import {
    Button,
    Card,
    Checkbox,
    Col,
    DatePicker,
    Divider,
    Form,
    InputNumber,
    PageHeader,
    Row,
    Space,
    Typography,
} from 'antd';
import MaterialTable, { MTableAction } from 'material-table';
import moment from 'moment';
import React, { CSSProperties, forwardRef, useEffect, useMemo } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import Swal from 'sweetalert2';

import type { getOferta, getOfertaVariables } from './__generated__/getOferta';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { apolloClient } from '../../utils/Requests';
import { saveOferta, saveOfertaVariables } from './__generated__/saveOferta';

const inlineStyles = {
    display: 'inline-block',
};
const inlineSpanStyles: CSSProperties = {
    ...inlineStyles,
    width: '24px',
    lineHeight: '32px',
    textAlign: 'center',
};
const onUpdateBaseCondicion = ({ id, ...data }: any) => {
    return new Promise((resolve, reject) => {
        let prop = data.idGrupo ? 'idGrupo' : 'idProducto';
        if (!id)
            resolve({
                ...data,
                [prop]: data[prop],
            });

        resolve({
            ...data,
            [prop]: id,
        });
    });
};
const baseOnAddBaseCondicion = async () => {
    const { value } = await Swal.fire({
        title: 'De que tipo sera la condicion?',
        input: 'select',
        inputOptions: {
            idProducto: 'Producto',
            idGrupo: 'Grupo',
        },
        inputPlaceholder: 'Seleccione un tipo',
        showCancelButton: true,
        inputValidator: (value) => {
            return new Promise<string | null>((resolve) => {
                if (value) {
                    resolve(null);
                } else {
                    resolve('Debes seleccionar un valor');
                }
            });
        },
    });
    return value;
};
const tableIcons = {
    Add: forwardRef<any, any>((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef<any, any>((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef<any, any>((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef<any, any>((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef<any, any>((props, ref) => (
        <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef<any, any>((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef<any, any>((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef<any, any>((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef<any, any>((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef<any, any>((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef<any, any>((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef<any, any>((props, ref) => (
        <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef<any, any>((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef<any, any>((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef<any, any>((props, ref) => (
        <ArrowDownward {...props} ref={ref} />
    )),
    ThirdStateCheck: forwardRef<any, any>((props, ref) => (
        <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef<any, any>((props, ref) => <ViewColumn {...props} ref={ref} />),
};
export const SpecialTable = (props: any) => {
    const { value: data } = props;
    return (
        <MaterialTable
            icons={tableIcons}
            columns={props.columns}
            data={data}
            editable={{
                isEditable: () => true,
                isDeletable: () => true,
                onRowUpdate: async (newData, oldData) => {
                    let index = data.indexOf(oldData);
                    let _data = [...data];
                    newData = await Promise.resolve(
                        props.onRowUpdate?.(newData, oldData)
                    ).then((resp) => {
                        return !resp ? newData : resp;
                    });
                    if (newData) {
                        _data[index] = newData;
                        props.onChange(_data);
                    }
                },
                onRowDelete: async (rowData) => {
                    props.onChange(data.filter((t: object) => t != rowData));
                },
                onRowAdd: async (newData) => {},
            }}
            components={{
                Action: (_props) => {
                    //If isn't the add action
                    if (
                        typeof _props.action === typeof Function ||
                        _props.action.tooltip !== 'Add'
                    ) {
                        return <MTableAction {..._props} />;
                    } else {
                        return (
                            <MTableAction
                                {..._props}
                                action={{
                                    ..._props.action,
                                    onClick: async () => {
                                        await Promise.resolve(props.onRowAdd?.()).then(
                                            (resp) => {
                                                if (!resp) return;
                                                props.onChange(data.concat(resp));
                                            }
                                        );
                                        //TODO: completar el agregar
                                    },
                                }}
                            />
                        );
                    }
                },
            }}
            options={{
                filtering: false,
                paging: false,
                showTitle: !!props.Title,
            }}
            title={props.Title}
        />
    );
};
const sharedCols = [
    {
        title: 'Producto/Grupo',
        field: 'id',
        render: (data1: any) => {
            return data1.idProducto ?? data1.idGrupo;
        },
    },

    {
        title: 'Tipo',
        field: 'tipo',
        editable: 'never',
        render: (data: any) => (data.idProducto ? 'producto' : 'grupo'),
    },
    {
        title: 'Cantidad',
        field: 'cantidad',
        type: 'numeric',
    },
];
const getOfertaQuery = gql`
    query getOferta($id: String) {
        oferta(id: $id) {
            activo
            condicion {
                cantidad
                idGrupo
                idOferta
                idProducto
                opcional
            }
            extra {
                cantidad
                idGrupo
                idOferta
                idProducto
            }
            fechaFinal
            fechaInicial
            porcentajeDescuento
            precioDescuento
        }
    }
`;

function MantOferta() {
    const params = useParams<{ id?: string }>();
    const [form] = Form.useForm();
    const history = useHistory();
    const match = useRouteMatch();

    const { loading, data, error, refetch } = useQuery<getOferta, getOfertaVariables>(
        getOfertaQuery,
        {
            variables: params,
        }
    );
    const parsedData = useMemo(() => {
        const oferta = data?.oferta ?? {
            fechaFinal: moment(),
            fechaInicial: moment(),
            porcentajeDescuento: 0,
        };

        return {
            ...oferta,
            fechaFinal: moment(oferta.fechaFinal),
            fechaInicial: moment(oferta.fechaInicial),
            porcentajeDescuento: oferta.porcentajeDescuento ?? 0,
        };
    }, [data]);
    useEffect(() => {
        Promise.resolve(refetch(params)).then(() => {
            form.resetFields();
        });
    }, [params.id]);

    if (loading) return <>loading</>;
    if (error) return <>error</>;

    // @ts-ignore
    return (
        <>
            <Card>
                <PageHeader
                    title="Mantenimiento Oferta"
                    breadcrumb={{
                        routes: [
                            {
                                path: '/',
                                breadcrumbName: 'Inicio',
                            },
                            {
                                path: 'ofertas',
                                breadcrumbName: 'Ofertas',
                            },
                            {
                                path: 'detalles',
                                breadcrumbName: 'Mantenimiento',
                            },
                        ],
                    }}
                />
            </Card>
            <Card>
                <Form
                    onFinish={(data) => {
                        apolloClient
                            .mutate<saveOferta, saveOfertaVariables>({
                                mutation: gql`
                                    mutation saveOferta(
                                        $activo: Boolean!
                                        $condicion: [ArgCondicionOferta!]!
                                        $extra: [ArgExtraOferta!]!
                                        $fechaFinal: DateTime!
                                        $fechaInicial: DateTime!
                                        $id: String
                                        $porcentajeDescuento: Float!
                                        $precioDescuento: Float!
                                    ) {
                                        saveOferta(
                                            activo: $activo
                                            condicion: $condicion
                                            extra: $extra
                                            fechaFinal: $fechaFinal
                                            fechaInicial: $fechaInicial
                                            id: $id
                                            porcentajeDescuento: $porcentajeDescuento
                                            precioDescuento: $precioDescuento
                                        )
                                    }
                                `,
                                variables: {
                                    activo: data.activo,
                                    fechaFinal: moment(data.fechaFinal).toDate(),
                                    fechaInicial: moment(data.fechaFinal).toDate(),
                                    id: params.id ?? undefined,
                                    porcentajeDescuento: data.porcentajeDescuento,
                                    precioDescuento: data.precioDescuento,
                                    condicion: data.condicion.map((t: any) => {
                                        let prop = t.idGrupo ? 'idGrupo' : 'idProducto';
                                        return {
                                            cantidad: t.cantidad,
                                            id: t[prop],
                                            opcional: t.opcional,
                                            typo:
                                                prop == 'idGrupo' ? 'grupo' : 'producto',
                                        };
                                    }),
                                    extra: data.extra.map((t: any) => {
                                        let prop = t.idGrupo ? 'idGrupo' : 'idProducto';
                                        return {
                                            cantidad: t.cantidad,
                                            id: t[prop],
                                            typo:
                                                prop == 'idGrupo' ? 'grupo' : 'producto',
                                        };
                                    }),
                                },
                            })
                            .then((resp) => {
                                if (
                                    (resp.errors && resp.errors.length > 0) ||
                                    !resp.data?.saveOferta
                                ) {
                                    alert('ha ocurrido un error al procesar los datos');
                                    return;
                                }
                                alert('datos salvados satisfactoriamente');
                                if (!params.id) {
                                    history.push(`/ofertas`);
                                    //TODO: replace history;
                                }
                            });
                    }}
                    form={form}
                    initialValues={parsedData}
                >
                    <Row>
                        <Col span={12}>
                            <div style={{ display: 'inline-flex', flexFlow: 'row' }}>
                                <Form.Item name={'fechaInicial'} label="rango">
                                    <DatePicker />
                                </Form.Item>
                                <span style={inlineSpanStyles}>-</span>
                                <Form.Item name={'fechaFinal'} style={inlineStyles}>
                                    <DatePicker />
                                </Form.Item>
                            </div>
                            <div style={{ display: 'inline-flex', flexFlow: 'row' }}>
                                <Form.Item name={'precioDescuento'} label="descuento">
                                    <InputNumber />
                                </Form.Item>
                                <span style={inlineSpanStyles}>/</span>
                                <Form.Item
                                    name={'porcentajeDescuento'}
                                    label="% descuento"
                                >
                                    <InputNumber
                                        min={0 as number}
                                        max={100}
                                        formatter={(value) => `${value}%`}
                                        parser={(value) =>
                                            +(value?.replace('%', '') ?? 0)
                                        }
                                    />
                                </Form.Item>
                            </div>
                        </Col>
                        <Col>
                            <Form.Item
                                valuePropName={'checked'}
                                name={'activo'}
                                label="Activo"
                            >
                                <Checkbox />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Col span={13}>
                            <Row>
                                <Typography>Condiciones</Typography>
                            </Row>
                            <Col span={24}>
                                <Form.Item name={'condicion'}>
                                    <SpecialTable
                                        onRowUpdate={onUpdateBaseCondicion}
                                        onRowAdd={async () => {
                                            const value = await baseOnAddBaseCondicion();
                                            if (value) {
                                                return {
                                                    [value]: '1',
                                                    cantidad: 0,
                                                    opcional: false,
                                                };
                                            }
                                        }}
                                        columns={[
                                            ...sharedCols,
                                            {
                                                title: 'Opcional',
                                                field: 'opcional',
                                                type: 'boolean',
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Col>
                        <Col span={10}>
                            <Row>
                                <Typography>Regalo</Typography>
                            </Row>
                            <Col span={24}>
                                <Form.Item name={'extra'}>
                                    <SpecialTable
                                        onRowUpdate={onUpdateBaseCondicion}
                                        onRowAdd={async () => {
                                            const value = await baseOnAddBaseCondicion();
                                            if (value) {
                                                return {
                                                    [value]: '1',
                                                    cantidad: 0,
                                                };
                                            }
                                        }}
                                        columns={[...sharedCols]}
                                    />
                                </Form.Item>
                            </Col>
                        </Col>
                    </Row>
                    <Divider />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Space>
                            <Button htmlType={'submit'} type="primary">
                                Salvar
                            </Button>
                            <Button onClick={() => history.goBack()} danger>
                                Cancelar
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Card>
        </>
    );
}

export default MantOferta;
