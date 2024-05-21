/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import InputField from '../../../components/InputField';
import { FormContainer } from './styles';
import api from '../../../services/api';

interface ScheduleFormProps {
    onSubmit: (values: { placa: string; data: string; horario: string; tipo: string }) => void;
    formRef: React.MutableRefObject<any>;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ onSubmit, formRef }) => {
    const [horarios, setHorarios] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [horarioDisabled, setHorarioDisabled] = useState<boolean>(true);

    useEffect(() => {
        const fetchHorarios = async () => {
            try {
                const response = await api.get(`agendamentos/horarios?data=${selectedDate}`);
                setHorarios(response.data.availableSlots);
            } catch (error) {
                console.error('Erro ao buscar horários:', error);
            }
        };

        if (selectedDate) {
            fetchHorarios();
            setHorarioDisabled(false);
        } else {
            setHorarioDisabled(true);
        }
    }, [selectedDate]);

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(event.target.value);
    };

    return (
        <Formik
            initialValues={{
                placa: '',
                data: '',
                horario: '',
                tipo: '',
            }}
            onSubmit={(values, { setSubmitting }) => {
                onSubmit(values);
                setSubmitting(false);
            }}
            innerRef={formRef}
        >
            {({ values, handleChange }) => (
                <Form>
                    <FormContainer>
                        <FormControl sx={{ marginBottom: '16px', width: '100%' }}>
                            <InputField
                                id='placa' 
                                name="placa"
                                label="Placa"
                                type='text'                            
                                textTransform="uppercase"
                                value={values.placa}
                                onChange={handleChange} 
                            />
                        </FormControl>
                        <FormControl sx={{ marginBottom: '16px', width: '100%' }}>
                            <InputField
                                id='data' 
                                name="data"
                                type='date'                            
                                value={values.data}
                                onChange={(e) => {
                                    handleChange(e);
                                    handleDateChange(e);
                                }}
                            />
                        </FormControl>
                        <FormControl sx={{ marginBottom: '16px', width: '100%' }}>
                            <InputLabel htmlFor="horario">Horário</InputLabel>
                            <Select
                                id="horario"
                                name="horario"
                                value={values.horario}
                                onChange={handleChange}
                                label="Horário"
                                disabled={horarioDisabled}
                            >
                                {horarios.map((horario) => (
                                    <MenuItem key={horario} value={horario}>
                                        {horario}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ marginBottom: '16px', width: '100%' }}>
                            <InputLabel htmlFor="tipo">Tipo de Lavagem</InputLabel>
                            <Select
                                id="tipo"
                                name="tipo"
                                value={values.tipo}
                                onChange={handleChange}
                                label="Tipo de Lavagem"
                            >
                                <MenuItem value="SIMPLES">Simples</MenuItem>
                                <MenuItem value="COMPLETA">Completa</MenuItem>
                            </Select>
                        </FormControl>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    );
};

export default ScheduleForm;
