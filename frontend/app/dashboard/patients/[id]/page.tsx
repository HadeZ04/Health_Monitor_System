import { notFound } from "next/navigation";
import { patientList } from "@/lib/data";
import { PatientDetailHeader } from "@/components/patients/PatientDetailHeader";
import { VitalsTrendCard } from "@/components/patients/VitalsTrendCard";
import { EhrTimeline } from "@/components/patients/EhrTimeline";
import { MedicationList } from "@/components/patients/MedicationList";
import { DoctorChatPanel } from "@/components/patients/DoctorChatPanel";

interface PatientDetailPageProps {
  params: { id: string };
}

export default function PatientDetailPage({ params }: PatientDetailPageProps) {
  const patient = patientList.find((item) => item.id === params.id);
  if (!patient) return notFound();

  return (
    <div className="space-y-6">
      <PatientDetailHeader id={patient.id} name={patient.name} age={patient.age} gender={patient.gender} condition={patient.condition} />
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <VitalsTrendCard />
          <EhrTimeline />
          <MedicationList />
        </div>
        <DoctorChatPanel />
      </div>
    </div>
  );
}
