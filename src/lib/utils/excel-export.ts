import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { Guest } from '@/lib/types/guest';

export async function exportGuestsToExcel(guests: Guest[], eventName: string) {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Guest List');


    worksheet.columns = [
        { header: 'No.', key: 'index', width: 5 },
        { header: 'Guest Name', key: 'name', width: 30 },
        { header: 'Mobile Number', key: 'mobileNumber', width: 15 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Table Number', key: 'tableNumber', width: 12 },
        { header: 'Food Preference', key: 'foodPreference', width: 15 },
        { header: 'Events', key: 'events', width: 25 },
        { header: 'Added On', key: 'createdAt', width: 15 },
    ];


    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' },
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
    });


    guests.forEach((guest, index) => {
        worksheet.addRow({
            index: index + 1,
            name: guest.name,
            mobileNumber: guest.mobileNumber,
            email: guest.email || 'N/A',
            tableNumber: guest.tableNumber || 'N/A',
            foodPreference: guest.foodPreference,
            events: guest.events.join(', '),
            createdAt: new Date(guest.createdAt).toLocaleDateString(),
        });
    });


    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
        }
    });


    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${eventName}_Guest_List_${new Date().toISOString().split('T')[0]}.xlsx`);
} 