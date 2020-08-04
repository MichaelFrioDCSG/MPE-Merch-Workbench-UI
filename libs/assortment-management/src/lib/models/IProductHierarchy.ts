export interface IProductHierarchy {
  departmentId: string;
  departmentDesc?: string;
  subDepartmentId: string;
  subDepartmentDesc?: string;
  classId: string;
  classDesc?: string;
  subClassId: string;
  subClassDesc?: string;

  // Display string
  departmentDisplay?: string;
  subDepartmentDisplay?: string;
  classDisplay?: string;
  subClassDisplay?: string;
}
