import { toast } from 'sonner'

interface ConfirmToastOptions {
  message: string
  actionLabel: string
  cancelLabel: string
  onConfirm: () => void | Promise<void>
}

export function showConfirmToast({ message, actionLabel, cancelLabel, onConfirm }: ConfirmToastOptions) {
  toast(message, {
    duration: 8000,
    cancel: {
      label: cancelLabel,
    },
    action: {
      label: actionLabel,
      onClick: () => {
        void onConfirm()
      },
    },
  })
}

export { toast }
