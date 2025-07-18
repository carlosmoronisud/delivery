import { toast } from 'react-toastify';

export function ToastAlerta(mensagem: string, tipo: 'sucesso' | 'erro' | 'info') {
  const options = {
    position: 'top-right' as const, // Use 'as const' for literal type
    autoClose: 2500, // Slightly increased autoClose time for better readability
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true, // Recommended for better user experience
    draggable: true,    // Recommended for better user experience
    theme: 'colored' as const, // Use 'as const' for literal type
    progress: undefined,
  };

  switch (tipo) {
    case 'sucesso':
      toast.success(mensagem, options);
      break;

    case 'erro':
      toast.error(mensagem, options);
      break;

    case 'info':
    default: // 'default' case handles 'info' and any other unexpected 'tipo'
      toast.info(mensagem, options);
      break;
  }
}