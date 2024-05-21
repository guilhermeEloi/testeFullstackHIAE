/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { IconButton, Tooltip } from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import Header from '../../components/Header';
import ButtonComponent from '../../components/Button';
import Modal from '../../components/Modal';
import ScheduleForm from './form';
import { Container, HeaderContainer, ContainerBody, ContainerOpacity, ContainerTable } from './styles';
import api from '../../services/api';

interface Scheduling {
    id: number;
    placa: string;
    data: string;
    horario: string;
    tipo: string;
    status: string;
}


const Home: React.FC = () => {
    const [schedules, setSchedules] = useState<Scheduling[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const formRef = useRef<any>(null);

    useEffect(() => {
        api.get('agendamentos').then((response: { data: Scheduling[] }) => {
            setSchedules(response.data);
            setTotalItems(response.data.length);
        });
    }, [openModal]);

    const handleConfirm = (id: number) => {
        api.put(`agendamentos/${id}/confirmar`)
            .then(() => {
                setSchedules(schedules.map(schedule =>
                    schedule.id === id ? { ...schedule, status: 'CONFIRMADO' } : schedule
                ));
                toast.success('Agendamento confirmado com sucesso!');
                window.location.reload();
            })
            .catch(error => {
                toast.error(error.response.data.error);
            });
    };

    const handleCancel = (id: number) => {
        api.put(`agendamentos/${id}/cancelar`)
            .then(() => {
                setSchedules(schedules.map(schedule =>
                    schedule.id === id ? { ...schedule, status: 'CANCELADO' } : schedule
                ));
                toast.success('Agendamento cancelado com sucesso!');
                window.location.reload();
            })
            .catch(error => {
                toast.error(error.response.data.error);
            });
    };

    const handleAddSchedule = (values: any) => {
        api.post('agendamentos', values)
            .then(response => {
                setSchedules([...schedules, response.data]);
                setOpenModal(false);
                window.location.reload();
            })
            .catch(error => {
                toast.error(error.response.data.error);
            });
    };

    const closeModal = () => {
        setOpenModal(false);
    };

    const handleFormSubmit = (values: any) => {
        handleAddSchedule(values);
    };

    const handleSaveButtonClick = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };

    const columns: GridColDef[] = [
        { field: 'placa', headerName: 'Placa', width: 150 },
        {
            field: 'data',
            headerName: 'Data',
            width: 150,
            valueFormatter: (params: string) => {
                const data = params as string;
                if (data) {
                    const dateParts = data.split('-');
                    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
                }
                return '-';
            }
        },
        { field: 'horario', headerName: 'Horário', width: 150 },
        { field: 'tipo', headerName: 'Tipo de Lavagem', width: 180 },
        { field: 'status', headerName: 'Status', width: 150 },
        {
            field: 'actions',
            headerName: 'Ações',
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <>
                    {params.row.status === 'PENDENTE' && (
                        <Tooltip title={'Confirmar'}>
                            <IconButton onClick={() => handleConfirm(params.row.id)}>
                                <Check color="primary" />
                            </IconButton>
                        </Tooltip>
                    )}
                    {params.row.status === 'CONFIRMADO' && (
                        <Tooltip title={'Cancelar'}>
                            <IconButton onClick={() => handleCancel(params.row.id)}>
                                <Close color="secondary" />
                            </IconButton>
                        </Tooltip>
                    )}
                </>
            ),
        },
    ];

    return (
        <Container>
            <ContainerOpacity>
                <Header />
                <HeaderContainer>
                    <ButtonComponent
                        title={'Novo Agendamento'}
                        variant={'contained'}
                        color={'primary'}
                        startIcon={<AddIcon />}
                        onClick={() => setOpenModal(true)}
                        backgroundColor={'#1c3286'}
                    >
                        Novo Agendamento
                    </ButtonComponent>
                </HeaderContainer>
                <ContainerBody>
                    <ContainerTable>
                        <DataGrid
                            rows={schedules}
                            columns={columns}
                            rowCount={totalItems}
                            pageSizeOptions={[5, 10]}
                            getRowId={(row) => row.id.toString()}
                            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                            sx={{
                                backgroundColor: '#d3d3d3',
                                '& .MuiDataGrid-scrollArea': {
                                    backgroundColor: '#00295B',
                                },
                                '& .MuiDataGrid-columnHeaderTitle': {
                                    fontFamily: 'Roboto, sans-serif',
                                    fontWeight: 800,
                                    fontSize: 20,
                                    color: '#00295B',
                                },
                                '& .MuiDataGrid-row': {
                                    fontFamily: 'Roboto, sans-serif',
                                    color: '#194A87',
                                    fontSize: 18,
                                },
                                '& .MuiDataGrid-cell': {
                                    borderBottom: '1px solid #c0c0c0',
                                },
                            }}
                        />
                    </ContainerTable>
                </ContainerBody>
            </ContainerOpacity>
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title={'Novo Agendamento'}
                children={
                    <ScheduleForm onSubmit={handleFormSubmit} formRef={formRef} />
                }
                actions={
                    <>
                        <ButtonComponent
                            title={'Cancelar'}
                            fontSize={16}
                            variant={'contained'}
                            onClick={closeModal}
                            size={'small'}
                            color={'error'}
                        />
                        <ButtonComponent
                            title={'Salvar'}
                            fontSize={16}
                            variant={'contained'}
                            onClick={handleSaveButtonClick}
                            size={'small'}
                            backgroundColor={'#1c3286'}
                        />
                    </>
                }
            >
            </Modal>
        </Container>
    );
};

export default Home;
