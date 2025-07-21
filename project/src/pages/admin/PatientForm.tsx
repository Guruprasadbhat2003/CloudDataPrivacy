import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Select from '../../components/ui/Select';
import { useData } from '../../hooks/useData';

function PatientForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getPatientById, addPatient, updatePatient } = useData();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
   bloodgroup: '',
    healthIssue: '',
    diagnosis: '',
    allergies: '',
    medications: '',
    notes: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isEditMode && id) {
      const patient = getPatientById(id);
      if (patient) {
        setFormData({
          firstName: patient.firstName,
          lastName: patient.lastName,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
          phone: patient.phone,
          email: patient.email || '',
          address: patient.address,
          emergencyContact: patient.emergencyContact,
         bloodgroup
    : patient.bloodType || '',
          healthIssue: patient.healthIssue,
          diagnosis: patient.diagnosis,
          allergies: patient.allergies,
          medications: patient.medications,
          notes: patient.notes || '',
        });
      } else {
        setError('Patient not found');
      }
    }
  }, [id, isEditMode, getPatientById]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (isEditMode && id) {
        updatePatient(id, formData);
      } else {
        addPatient(formData as any);
      }
      navigate('/admin');
    } catch (err) {
      setError('An error occurred while saving the patient record');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Patient Record' : 'Add New Patient'}
        </h1>
        <Button
          onClick={() => navigate('/admin')}
          variant="outline"
          leftIcon={<ArrowLeft size={16} />}
        >
          Back to Dashboard
        </Button>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      <Card>
        <Card.Body>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h2 className="text-lg font-medium mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <Input
                    label="First Name"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  
                  <Input
                    label="Last Name"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                  
                  <Input
                    label="Date of Birth"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                  
                  <Select
                    label="Gender"
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    options={[
                      { value: '', label: 'Select gender' },
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' },
                    ]}
                  />
                  
                  <Input
                    label="Blood Type"
                    id="bloodType"
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                  />
                </div>
                
                <h2 className="text-lg font-medium mt-8 mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <Input
                    label="phone"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  
                  <Input
                    label="Email"
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  
                  <TextArea
                    label="Address"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                  />
                  
                  <Input
                    label="Emergency Contact"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    required
                    helperText="Name and phone number of emergency contact"
                  />
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-medium mb-4">Medical Information</h2>
                <div className="space-y-4">
                  <Input
                    label="Health Issue"
                    id="healthIssue"
                    name="healthIssue"
                    value={formData.healthIssue}
                    onChange={handleChange}
                    required
                    helperText="Primary health condition (e.g., Diabetes, Heart Disease)"
                  />
                  
                  <TextArea
                    label="Diagnosis"
                    id="diagnosis"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    required
                    rows={2}
                  />
                  
                  <TextArea
                    label="Allergies"
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    required
                    rows={2}
                    helperText="List all allergies or 'None' if not applicable"
                  />
                  
                  <TextArea
                    label="Medications"
                    id="medications"
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                    required
                    rows={3}
                    helperText="Current medications with dosage"
                  />
                  
                  <TextArea
                    label="Additional Notes"
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                className="mr-4"
                onClick={() => navigate('/admin')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                leftIcon={<Save size={16} />}
              >
                {isEditMode ? 'Update Patient' : 'Save Patient'}
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default PatientForm;