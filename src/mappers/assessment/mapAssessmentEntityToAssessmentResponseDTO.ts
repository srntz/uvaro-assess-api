import { Assessment } from "../../models/Assessment";
import { AssessmentResponseDTO } from "../../dto/assessment/AssessmentResponseDTO";

export function mapAssessmentEntityToAssessmentResponseDTO(
  assessment: Assessment,
): AssessmentResponseDTO {
  return new AssessmentResponseDTO(
    assessment.assessment_id,
    assessment.start_date_time,
    assessment.end_date_time,
    assessment.user_id,
  );
}
