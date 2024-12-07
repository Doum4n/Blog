import {TablePagination} from "@mui/material";

const Pagination = ({ page, onPageChange, rowsPerPage, onRowPerPageChange }) => {
    const handleChangePage = (newPage) => {
        onPageChange(newPage); // Sử dụng `newPage` thay vì lấy từ event
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        onRowPerPageChange(newRowsPerPage); // Cập nhật rowsPerPage
        onPageChange(0); // Reset về trang đầu tiên
    };

    return (
        <TablePagination
            component="div"
            count={100} // Tổng số hàng (có thể truyền từ props)
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    );
};

export default Pagination;