import { useToast } from 'primevue/usetoast'

export function useNotificaciones() {
  const toast = useToast()

  return {
    exito(detalle) {
      toast.add({
        severity: 'success',
        summary: 'Operación completada',
        detail: detalle,
        life: 3000
      })
    },
    error(detalle) {
      toast.add({
        severity: 'error',
        summary: 'No se pudo completar la operación',
        detail: detalle,
        life: 5000
      })
    }
  }
}
