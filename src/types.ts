
// id type string or number
export type Id = string | number;

// column type has id and title
export type Column = {
    id: Id;
    title: string;
};

// task type has id, columnId, and content
export type Task ={
    id: Id,
    columnId: Id,
    content: string,
};