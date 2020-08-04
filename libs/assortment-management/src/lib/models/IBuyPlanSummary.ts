export interface IBuyPlanSummary {
  departmentId: string;
  departmentDesc?: string;
  subDepartmentId: string;
  subDepartmentDesc?: string;
  classId: string;
  classDesc?: string;
  subClassId: string;
  subClassDesc?: string;

  departmentDisplay?: string;
  subDepartmentDisplay?: string;
  classDisplay?: string;
  subClassDisplay?: string;
}
