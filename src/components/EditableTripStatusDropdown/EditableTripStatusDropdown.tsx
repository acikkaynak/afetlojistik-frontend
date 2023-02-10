import { useEffect } from 'react'
import { Form, Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { GenericDropdown } from 'components/GenericDropdown'
import { TripsStatuses, tripStatusOptions } from 'constants/trip'
import { RowEditButton } from 'components/ui/RowEditButton'
import { EditTripStatusFormType } from 'types/trip'
import { editTripStatusInitialValues, validationSchema } from './formHelper'
import styles from './EditableTripStatusDropdown.module.scss'

type EditableTripStatusDropdownProps = {
  isEditing?: boolean
  formId: string
  tripId: string
  currentStatus: TripsStatuses
  onSubmit: (values: EditTripStatusFormType) => void
  setEditingRows: React.Dispatch<React.SetStateAction<string[]>>
}
export const EditableTripStatusDropdown: React.FC<EditableTripStatusDropdownProps> = ({
  isEditing,
  formId,
  tripId,
  currentStatus,
  onSubmit,
  setEditingRows
}) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const formik = useFormik({
    initialValues: editTripStatusInitialValues,
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values)
    },
    enableReinitialize: true,
    validateOnChange: true
  })
  const { values, setValues, touched, handleSubmit, resetForm, errors } = formik
  useEffect(() => {
    form.setFieldsValue({
      ...values
    })
  }, [form, values])
  useEffect(() => {
    if (isEditing) {
      setValues({ tripId, status: currentStatus })
      form.setFieldsValue({ tripId, status: currentStatus })
    } else {
      resetForm()
      setValues({ tripId: undefined, status: currentStatus })
      form.setFieldsValue({ tripId: undefined, status: currentStatus })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing])
  const handleStatusChange = (status: TripsStatuses) => {
    setValues({ ...values, status })
  }

  if (!currentStatus) {
    return null
  }

  const label = t(tripStatusOptions[currentStatus].label)
  const color = tripStatusOptions[currentStatus].color
  if (isEditing) {
    return (
      <>
        <Form className={styles.form} id={formId} form={form}>
          <Form.Item
            name='status'
            validateStatus={touched.status && errors.status ? 'error' : undefined}
            help={touched.status && errors.status}
          >
            <GenericDropdown value={values.status} options={tripStatusOptions} onChange={handleStatusChange} />
          </Form.Item>
        </Form>
        <RowEditButton
          formId='editTripStatusForm'
          onEditChange={setEditingRows}
          onReset={setEditingRows}
          // TODO: Update when endpoint is ready
          handleSubmit={handleSubmit}
        />
      </>
    )
  }
  return <Tag color={color}>{label}</Tag>
}
