const API_BASE_URL =
import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

function mapTicket(ticket) {
    return {
        ticket_id: ticket.ticketId,
        created_by_employee_id: ticket.createdByEmployeeId,
        customer_id: ticket.customerId,
        rental_id: ticket.rentalId,
        subject: ticket.subject,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        created_at: ticket.createdAt,
    }
}

async function parseResponse(response, fallbackMessage) {
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(
            data.message ||
            data.error ||
            data.detail ||
            fallbackMessage
        )
    }

    return data
}

export async function getTickets() {
    const response = await fetch(`${API_BASE_URL}/api/tickets`)

    const data = await parseResponse(
        response,
        'Unable to load tickets.'
    )

    return data.map(mapTicket)
}

export async function createTicket(payload) {
    const response = await fetch(`${API_BASE_URL}/api/tickets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            createdByEmployeeId: payload.created_by_employee_id,
            customerId: payload.customer_id,
            rentalId: payload.rental_id,
            subject: payload.subject,
            description: payload.description,
            priority: payload.priority,
        }),
    })

    const ticket = await parseResponse(
        response,
        'Unable to create ticket.'
    )

    return mapTicket(ticket)
}

export async function updateTicketStatus(ticketId, status) {
    const response = await fetch(
        `${API_BASE_URL}/api/tickets/${ticketId}/status`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        }
    )

    const ticket = await parseResponse(
        response,
        'Unable to update ticket.'
    )

    return mapTicket(ticket)
}
