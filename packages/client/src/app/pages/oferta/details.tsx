import {
    Breadcrumb,
    Button,
    Checkbox,
    Col,
    DatePicker,
    Divider,
    Form,
    InputNumber,
    Layout,
    Row,
    Space,
    Table,
    Typography,
} from 'antd';
import { Card } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import React, { CSSProperties } from 'react';
const inlineStyles = {
    display: 'inline-block',
};
const inlineSpanStyles: CSSProperties = {
    ...inlineStyles,
    width: '24px',
    lineHeight: '32px',
    textAlign: 'center',
};

const columns: ColumnsType<typeof data[0]> = [
    {
        title: 'Producto/Grupo',
        key: 'producto',
        render: (_text: any, record) => <span>{record.producto ?? record.grupo}</span>,
    },
    {
        title: 'Cantidad',
        dataIndex: 'cantidad',
        key: 'cantidad',
    },
    {
        title: 'Opcional',
        dataIndex: 'opcional',
        key: 'opcional',
        render: (text) => <Checkbox checked={text} />,
    },
    {
        title: 'Action',
        key: 'action',
        render: (_text, record) => (
            <Space size="middle">
                <Button onClick={(_t) => console.log(record)}>X</Button>
            </Space>
        ),
    },
];
type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
    {
        [K in Keys]-?: Required<Pick<T, K>> &
            Partial<Record<Exclude<Keys, K>, undefined>>;
    }[Keys];

type BaseDataType = {
    producto?: string;
    grupo?: string;
    cantidad: number;
    opcional: boolean;
};
type BaseDataTypeExtra = Omit<BaseDataType, 'opcional'> & { precio: number };

type DataType = RequireOnlyOne<BaseDataType, 'producto' | 'grupo'>;
type DataTypeExtra = RequireOnlyOne<BaseDataTypeExtra, 'producto' | 'grupo'>;
const data: DataType[] = [
    {
        producto: 'Malteada',
        cantidad: 1,
        opcional: false,
    },
];
const dataExtra: Array<DataTypeExtra> = [
    {
        producto: 'Malteada',
        cantidad: 1,
        precio: 0,
    },
];

const columnsExtra: ColumnsType<typeof dataExtra[0]> = [
    {
        title: 'Producto/Grupo',
        key: 'producto',
        render: (_text, record) => <span>{record.producto ?? record.grupo}</span>,
    },
    {
        title: 'Cantidad',
        dataIndex: 'cantidad',
        key: 'cantidad',
    },
    {
        title: 'precio',
        dataIndex: 'precio',
        key: 'precio',
    },
    {
        title: 'Action',
        key: 'action',
        render: (_text, record) => (
            <Space size="middle">
                <Button onClick={() => console.log(record)}>X</Button>
            </Space>
        ),
    },
];

function MantOferta() {
    return (
        <Card
            title="Mantenimiento Oferta"
            extra={
                <Breadcrumb>
                    <Breadcrumb.Item>Ofertas</Breadcrumb.Item>
                    <Breadcrumb.Item>Mantenimiento</Breadcrumb.Item>
                </Breadcrumb>
            }
        >
            <Form>
                <Row>
                    <Col span={12}>
                        <div style={{ display: 'inline-flex', flexFlow: 'row' }}>
                            <Form.Item label="rango">
                                <DatePicker />
                            </Form.Item>
                            <span style={inlineSpanStyles}>-</span>
                            <Form.Item style={inlineStyles}>
                                <DatePicker />
                            </Form.Item>
                        </div>
                        <div style={{ display: 'inline-flex', flexFlow: 'row' }}>
                            <Form.Item label="descuento">
                                <InputNumber />
                            </Form.Item>
                            <span style={inlineSpanStyles}>/</span>
                            <Form.Item label="% descuento">
                                <InputNumber
                                    defaultValue={100}
                                    min={0 as number}
                                    max={100}
                                    formatter={(value) => `${value}%`}
                                    parser={(value) => +(value?.replace('%', '') ?? 0)}
                                />
                            </Form.Item>
                        </div>
                    </Col>
                    <Col span={12}></Col>
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Col span={11}>
                        <Row>
                            <Typography>Condiciones</Typography>
                        </Row>
                        <Col span={24}>
                            <Table
                                rowKey={(t) => t.producto ?? t.grupo}
                                columns={columns}
                                dataSource={data}
                            />
                        </Col>
                    </Col>
                    <Col span={12}>
                        <Row>
                            <Typography>Regalo</Typography>
                        </Row>
                        <Col span={24}>
                            <Table
                                rowKey={(t) => t.producto ?? t.grupo}
                                columns={columnsExtra}
                                dataSource={dataExtra}
                            />
                        </Col>
                    </Col>
                </Row>
            </Form>
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Space>
                    <Button>Generar Notificacion</Button>
                    <Button type="primary">Salvar</Button>
                    <Button danger>Cancelar</Button>
                </Space>
            </div>
        </Card>
    );
}

export default MantOferta;
