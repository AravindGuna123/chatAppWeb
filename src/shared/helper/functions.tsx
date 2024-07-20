import { notification } from "antd";

export const errorNotification = (data: string): void => {
    notification.error({
      message: <div style={{ color: '#D0250E', fontWeight: 600, fontSize: 14 }}>Error</div>,
      description: <div style={{ color: '#D0250E', fontWeight: 400, fontSize: 12 }}>{data}</div>,
      duration: 3,
      style: {
        backgroundColor: '#ffe7e3',
        border: '1px solid #D0250E',
      },
    });
  };
  
  export const successNotification = (data: string): void => {
    notification.success({
      message: <div style={{ color: '#1B8201', fontWeight: 600, fontSize: 14 }}>Success</div>,
      description: <div style={{ color: '#1B8201', fontWeight: 400, fontSize: 12 }}>{data}</div>,
      duration: 5,
      style: {
        backgroundColor: '#dcffeb',
        border: '1px solid #1B8201',
      },
    });
  };
  
  export const warningNotification = (data: string): void => {
    notification.warning({
      message: <div style={{ color: '#A97A00', fontWeight: 600, fontSize: 14 }}>Warning</div>,
      description: <div style={{ color: '#A97A00', fontWeight: 400, fontSize: 12 }}>{data}</div>,
      duration: 5,
      style: {
        backgroundColor: '#fef2d4',
        border: '1px solid #A97A00',
      },
    });
  };