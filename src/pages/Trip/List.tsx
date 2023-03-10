import React, { useState } from 'react'
import { CrudFilters, HttpError, IResourceComponentsProps } from '@pankod/refine-core'
import { useTable, List, Table, Space, EditButton, ShowButton, DateField, Tag, DatePicker } from '@pankod/refine-antd'
import { useTranslation } from 'react-i18next'
import { FaTruck, FaIdCard, FaPhone } from 'react-icons/fa'
import { Button, Modal } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { EditTripStatusFormType, TripListFilterPostType, TripListFilterTypes, TripType } from 'types/trip'
import { VehicleType } from 'types/vehicle'
import { LocationType } from 'types/location'
import { UserType } from 'types/user'
import { EditableTripStatusDropdown } from 'components/EditableTripStatusDropdown'
import { RowEditButton } from 'components/ui/RowEditButton'
import { updateTripStatus } from 'services/trip'
import { ExportTableDropdown } from 'components/ExportTableDropdown'
import { TripStatuses } from 'constants/trip'
import { TripListFilter } from './TripListFilter'

export const TripList: React.FC<IResourceComponentsProps<TripType>> = () => {
  const { t } = useTranslation()
  const [editingRows, setEditingRows] = useState<string[]>([])
  const [isUpdating, setIsUpdating] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalValues, setModalValues] = useState<EditTripStatusFormType>()
  const [arrivedTimeInput, setArrivedTimeInput] = useState<Dayjs>()

  const { tableProps, searchFormProps, tableQueryResult, setFilters } = useTable<
    TripListFilterPostType,
    HttpError,
    TripListFilterTypes
  >({
    defaultSetFilterBehavior: 'replace',
    onSearch: (params) => {
      const filters: CrudFilters = []
      const {
        statuses,
        truckPlateNumber,
        trailerPlateNumber,
        fromCityId,
        toCityId,
        toDistrictId,
        fromDistrictId,
        productCategoryIds,
        createdAt
      } = params

      filters.push(
        {
          field: 'statuses',
          operator: 'eq',
          value: statuses
        },
        {
          field: 'truckPlateNumber',
          operator: 'eq',
          value: truckPlateNumber
        },
        {
          field: 'fromCityId',
          operator: 'eq',
          value: fromCityId
        },
        {
          field: 'toCityId',
          operator: 'eq',
          value: toCityId
        },
        {
          field: 'toDistrictId',
          operator: 'eq',
          value: toDistrictId
        },
        {
          field: 'fromDistrictId',
          operator: 'eq',
          value: fromDistrictId
        },
        {
          field: 'trailerPlateNumber',
          operator: 'eq',
          value: trailerPlateNumber
        },
        {
          field: 'productCategoryIds',
          operator: 'eq',
          value: productCategoryIds
        },
        {
          field: 'startDate',
          operator: 'gte',
          value: createdAt ? createdAt[0].toISOString() : undefined
        },
        {
          field: 'endDate',
          operator: 'lte',
          value: createdAt ? createdAt[1].toISOString() : undefined
        }
      )

      return filters
    }
  })

  const handleUpdate = (values: EditTripStatusFormType) => {
    if (Number(values.status) !== TripStatuses.Arrived || values.arrivedTime) {
      setIsUpdating(true)
      updateTripStatus(values)
        .then(() => {
          tableQueryResult.refetch()
          setEditingRows([])
        })
        .finally(() => {
          setIsUpdating(false)
          setIsModalOpen(false)
          setArrivedTimeInput(undefined)
          setModalValues(undefined)
        })
    } else {
      setModalValues(values)
      setIsModalOpen(true)
    }
  }

  const resetFilters = () => {
    setFilters([])
  }

  return (
    <List title={t('pageTitles.trips')}>
      <Space direction='vertical' size={20}>
        <TripListFilter formProps={searchFormProps} resetFilters={resetFilters} />
        <Space align='end' direction='vertical'>
          <ExportTableDropdown
            tableId='trip-list-table'
            enabledExports={['excel', 'print']}
            hiddenColumnIndices={[0, 9]}
          />
        </Space>
        <Table {...tableProps} rowKey='tripNumber' id='trip-list-table'>
          <Table.Column dataIndex='tripNumber' title='Sefer No' />
          <Table.Column
            dataIndex='createdBy'
            title={t('createdBy') as string}
            render={(value: UserType) => `${value.name} ${value.surname}`}
          />
          <Table.Column
            dataIndex=''
            title={t('status') as string}
            render={(trip: TripType) => {
              const isEditing = editingRows.includes(trip._id)
              return (
                <>
                  <EditableTripStatusDropdown
                    formId='editTripStatusForm'
                    tripId={trip._id}
                    isEditing={isEditing}
                    currentStatus={trip.status}
                    onSubmit={handleUpdate}
                  />
                  <RowEditButton
                    formId='editTripStatusForm'
                    recordId={trip._id}
                    editingRowIds={editingRows}
                    onEditChange={setEditingRows}
                    onReset={setEditingRows}
                    isLoading={isUpdating}
                  />
                </>
              )
            }}
          />
          <Table.Column
            dataIndex={['estimatedDepartTime']}
            title={t('estimatedDepartTime') as string}
            render={(value: string) => <DateField value={value} />}
          />
          <Table.Column
            dataIndex={['fromLocation']}
            title={t('sourceLocation') as string}
            render={(fromLocation: LocationType) => (
              <Space direction='horizontal' size={8} className='flex align-center'>
                <Tag className='mie-0'>
                  {fromLocation.cityName}-{fromLocation.districtName}
                </Tag>
              </Space>
            )}
          />
          <Table.Column
            dataIndex={['toLocation']}
            title={t('destinationLocation') as string}
            render={(toLocation: LocationType) => (
              <Space direction='horizontal' size={8} className='flex align-center'>
                <Tag className='mie-0'>
                  {toLocation.cityName}-{toLocation.districtName}
                </Tag>
              </Space>
            )}
          />
          <Table.Column
            dataIndex={['vehicle']}
            title={t('vehicleInfo') as string}
            render={(vehicle: VehicleType) => (
              <Space direction='vertical'>
                <Tag className='flex gap-4 align-center' icon={<FaTruck />}>
                  {vehicle?.plate?.truck ?? '-'}
                </Tag>
                <Tag className='flex gap-4 align-center' icon={<FaIdCard />}>
                  {vehicle?.name ?? '-'}
                </Tag>
                <a href={`tel:${vehicle?.phone ?? '-'}`}>
                  <Tag className='flex gap-4 align-center' icon={<FaPhone />}>
                    {vehicle?.phone ?? '-'}
                  </Tag>
                </a>
              </Space>
            )}
          />
          <Table.Column
            dataIndex={['createdAt']}
            title={t('createdAt') as string}
            render={(value: string) => <DateField value={value} format={'DD/MM/YYYY'} />}
          />
          <Table.Column
            dataIndex={['updatedAt']}
            title={t('updatedAt') as string}
            render={(value: string) => <DateField value={value} format={'DD/MM/YYYY'} />}
          />
          <Table.Column
            title={t('actions') as string}
            dataIndex='actions'
            render={(_, record: TripType) => (
              <Space>
                <EditButton hideText size='small' recordItemId={record._id} />
                <ShowButton hideText size='small' recordItemId={record._id} />
              </Space>
            )}
          />
        </Table>
      </Space>
      <Modal
        title={t('enterArrivedTime')}
        open={isModalOpen}
        onCancel={() => {
          setEditingRows([])
          setArrivedTimeInput(undefined)
          setIsModalOpen(false)
        }}
        footer={[
          <div key='footer' className='flex flex-sb'>
            <Button
              onClick={() => {
                const valuesWithDate = { ...modalValues, arrivedTime: arrivedTimeInput }
                handleUpdate(valuesWithDate)
              }}
              type='primary'
            >
              {t('save')}
            </Button>
          </div>
        ]}
      >
        <DatePicker
          showTime
          showSecond={false}
          format='YYYY-MM-DD HH:mm'
          onChange={(value) => setArrivedTimeInput(value ? dayjs(value) : undefined)}
        />
      </Modal>
    </List>
  )
}
