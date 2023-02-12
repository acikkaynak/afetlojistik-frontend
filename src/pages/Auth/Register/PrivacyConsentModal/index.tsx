import React from 'react'
import { Modal, Space, Typography } from 'antd'

interface PrivacyConsentProps {
  visible: boolean
  handleOk: () => void
  handleCancel: () => void
}

export const PrivacyConsentModal: React.FC<PrivacyConsentProps> = ({ visible, handleOk, handleCancel }) => (
  <Modal
    title={'Kişisel Verilerin İşlenmesine İlişkin Aydınlatma:'}
    open={visible}
    onOk={handleOk}
    onCancel={handleCancel}
    okText={'Kabul Ediyorum'}
    cancelText={'Kabul Etmiyorum'}
  >
    <Space direction='vertical' size='large' style={{ paddingBottom: '20px' }}>
      <Typography.Text>
        Bu uygulama, 6 Şubat 2023 tarihinde Türkiye’de meydana gelen büyük deprem felaketinde, arama kurtarma
        çalışmaları ile yardım ve destek taleplerini ortak bir veri tabanında toplayarak yetkili kurum ve kuruluşlara
        aktarmak amacı ile bilişim teknolojileri alanında çalışan gönüllüler tarafından oluşturulmuştur. Yardım ya da
        desteğe ihtiyacı olduğunu belirttiğiniz kişilerin kişisel verileri ‘’Fiili imkânsızlık nedeniyle rızasını
        açıklayamayacak durumda bulunan veya rızasına hukuki geçerlilik tanınmayan kişinin kendisinin ya da bir
        başkasının hayatı veya beden bütünlüğünün korunması için zorunlu olması’’ hukuki sebebine dayanarak, otomatik
        yollarla işlenecektir. Tarafınıza ait kişisel veriler, ‘’Bir hakkın tesisi, kullanılması veya korunması için
        veri işlemenin zorunlu olması’’ hukuki sebebine dayanarak işlenecektir. Paylaşacağınız yardım, destek
        taleplerinde yer alan isim, soyisim, telefon ve adres gibi kişisel veriler, tarafımızca oluşturulan ve
        sunucuları yurtiçi ve yurtdışında bulunan veri tabanında toplanarak, Afad, Akut, Kızılay gibi yetkili arama
        kurtarma kuruluşlarının yanı sıra destek ve yardım taleplerini karşılayabilecek sivil toplum kuruluşları ile
        kişisel veri işleme amacı ile sınırlı olarak paylaşılacaktır.
      </Typography.Text>
    </Space>
    <Space direction='vertical'>
      <Typography.Title level={5}>Form dolduran kişiden hukuki beyan:</Typography.Title>
      <Typography.Text>
        Enkaz, yıkım, yardım ve destek ihtiyaçları konusunda verdiğim bilgilerin doğru ve teyit edilmiş olduğunu, bilgi
        kirliliği ve yanlış uygulamalara yol açmamak için gerekli tüm önlem ve tedbirleri aldığımı, vermiş olduğum
        bilgilerde meydana gelen değişiklik ve güncellemeleri bildireceğimi kabul ve beyan ederim.
      </Typography.Text>
    </Space>
  </Modal>
)
