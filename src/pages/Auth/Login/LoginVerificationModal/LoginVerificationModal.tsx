import { Button, Form, Image, Modal, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { useLogin } from '@pankod/refine-core'
import { OtpInput } from 'components/OtpInput'
import { VerifyAuthCodeFormType } from 'types/otp'
import { resendAuthCode } from 'services/otp'
import { initialValues, validationSchema } from './formHelper'
import './LoginVerificationModal.scss'

type LoginVerificationModalProps = {
  phone?: number
  isVisible: boolean
  onClose: () => void
}

export const LoginVerificationModal: React.FC<LoginVerificationModalProps> = ({ isVisible, phone, onClose }) => {
  const { t } = useTranslation()

  const [autoSubmit, setAutoSubmit] = useState(true)

  const { mutateAsync: logInUser, isLoading } = useLogin<VerifyAuthCodeFormType>()

  const [form] = Form.useForm()
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      logInUser(values).catch(resetModal)
    }
  })

  const { values, setValues, handleSubmit, touched, errors, resetForm } = formik

  const resetModal = () => {
    setAutoSubmit(false)
    setValues({ ...initialValues, phone })
    form.setFieldsValue({ ...initialValues, phone })
  }

  const handleResetForm = () => {
    resetForm({ values: initialValues })
    form.setFieldsValue(initialValues)
  }

  useEffect(() => {
    if (isVisible && phone) {
      setValues({ ...initialValues, phone })
      form.setFieldsValue({ initialValues, phone })
    } else {
      handleResetForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible])

  useEffect(() => {
    form.setFieldsValue({
      ...values
    })
  }, [form, values])

  const handleOtpChange = (code: string) => {
    setValues({ ...values, code })
  }

  const handleResend = (phone?: number) => {
    if (phone) {
      resendAuthCode(phone.toString())
    }
  }

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      destroyOnClose
      title={
        <Typography.Title level={5} className='verification-modal-title text-purple'>
          {t('auth.verifyTitle')}
        </Typography.Title>
      }
      centered
      className='login-verification-modal'
      footer={
        <Button
          className='verification-submit-btn'
          size='large'
          type='primary'
          loading={isLoading}
          form='verifyAuthCodeForm'
          htmlType='submit'
          block
        >
          {t('auth.verifyAndLogin')}
        </Button>
      }
    >
      <Space align='center' direction='vertical' size={16}>
        <Image src='/images/otp.svg' preview={false} alt='otp' />
        <Typography.Text>{t('auth.sendCodeDescription')}</Typography.Text>
        <Typography.Text strong>{phone}</Typography.Text>
        <Form id='verifyAuthCodeForm' onFinish={handleSubmit} form={form}>
          <OtpInput
            name='code'
            formProps={{
              id: 'verifyAuthCodeForm',
              required: true,
              rules: [{ required: true, message: t('thisFieldIsRequired') }]
            }}
            errorMessage={errors.code}
            isTouched={touched.code}
            value={values.code}
            autoFocus
            length={6}
            onChangeValue={handleOtpChange}
            disabled={isLoading}
            handleAutoSubmit={autoSubmit ? handleSubmit : undefined}
          />
        </Form>
        <div className='resend-code'>
          <Button onClick={() => handleResend(values.phone)} type='link'>
            {t('auth.resendCode')}
          </Button>
        </div>
        {/* do not delete */}
        <div style={{ display: 'none' }}>{t('errorMessages.errorTitle')}</div>
        <div style={{ display: 'none' }}>{t('notifications.success')}</div>
      </Space>
    </Modal>
  )
}
