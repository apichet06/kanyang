// alertUtils.tsx
import Swal from 'sweetalert2';

export function showSuccessAlert(message) {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 2000,
    });
}

export function showErrorAlert(message) {
    Swal.fire({
        position: 'center',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 5000,
    });
}

export function showDeleteAlert(message) {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 2000,
    });
}

