import React from 'react';

import {
    Ambulance,
    ArrowLeft,
    ArrowRight,
    BedDouble,
    Building2,
    Check,
    CheckCircle2,
    Clock3,
    FileCheck2,
    HeartPulse,
    Hospital,
    Info,
    MapPin,
    Phone,
    ShieldCheck,
    Stethoscope,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import AuthLayout from '../../layouts/AuthLayout';

const CURRENT_YEAR = new Date().getFullYear();

const LIMITS = {
    establishedYearMin: 1800,
    establishedYearMax: CURRENT_YEAR,

    bedsMax: 100000,
    ambulancesMax: 10000,

    pincodeLength: 6,
};

const STEPS = [
    {
        id: 1,
        title: 'Basic information',
        shortTitle: 'Basic',
        icon: Building2,
    },
    {
        id: 2,
        title: 'Contact & location',
        shortTitle: 'Location',
        icon: MapPin,
    },
    {
        id: 3,
        title: 'Emergency services',
        shortTitle: 'Emergency',
        icon: HeartPulse,
    },
    {
        id: 4,
        title: 'Hospital services',
        shortTitle: 'Services',
        icon: Stethoscope,
    },
    {
        id: 5,
        title: 'Capacity & ambulance',
        shortTitle: 'Capacity',
        icon: Ambulance,
    },
    {
        id: 6,
        title: 'Verification',
        shortTitle: 'Verify',
        icon: FileCheck2,
    },
];

const HOSPITAL_TYPES = [
    'Government Hospital',
    'Private Hospital',
    'Public-Private Partnership',
    'Trust / Charitable Hospital',
    'Specialty Hospital',
    'Medical College Hospital',
];

const STATES = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
];

const SERVICES = [
    '24×7 Emergency Department',
    'Trauma Care',
    'ICU',
    'NICU',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'General Surgery',
    'Neurosurgery',
    'Pediatrics',
    'Obstetrics & Gynecology',
    'Radiology',
    'Pathology',
    'Dialysis',
    'Blood Bank',
    'Pharmacy',
];

const INITIAL_FORM = {
    hospitalName: '',
    hospitalType: '',
    registrationNumber: '',
    registrationAuthority: '',
    establishedYear: '',

    officialPhone: '',
    officialEmail: '',
    address: '',
    city: '',
    state: '',
    pincode: '',

    locationConfirmed: false,

    emergencyAvailable: '',
    emergencyPhone: '',
    emergencyHours: '24×7',
    traumaCare: '',
    emergencyNotes: '',

    services: [],

    totalBeds: '',
    emergencyBeds: '',
    icuBeds: '',
    nicuBeds: '',
    ventilators: '',
    oxygenBeds: '',

    ambulanceCount: '',
    basicLifeSupport: '',
    advancedLifeSupport: '',
    ambulanceNotes: '',

    authorizedRepresentative: '',
    designation: '',
    declarationAccepted: false,
    termsAccepted: false,
};

function HospitalProfileSetup() {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = React.useState(1);
    const [formData, setFormData] = React.useState(INITIAL_FORM);
    const [error, setError] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const currentStepData = STEPS.find(
        (step) => step.id === currentStep,
    );

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }));

        setError('');
    };

    const handleNumericChange = (event, max) => {
        const { name, value } = event.target;

        if (value === '') {
            setFormData((current) => ({
                ...current,
                [name]: '',
            }));

            setError('');
            return;
        }

        if (!/^\d+$/.test(value)) {
            return;
        }

        const numericValue = Number(value);

        if (numericValue > max) {
            setFormData((current) => ({
                ...current,
                [name]: String(max),
            }));

            setError(`Maximum allowed value is ${max.toLocaleString()}.`);
            return;
        }

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));

        setError('');
    };

    const toggleService = (service) => {
        setFormData((current) => {
            const exists = current.services.includes(service);

            return {
                ...current,
                services: exists
                    ? current.services.filter(
                        (item) => item !== service,
                    )
                    : [...current.services, service],
            };
        });

        setError('');
    };

    const confirmHospitalLocation = () => {
        if (
            !formData.address.trim() ||
            !formData.city.trim() ||
            !formData.state ||
            !formData.pincode.trim()
        ) {
            setError(
                'Please complete the hospital address, city, state and pincode before confirming the location.',
            );
            return;
        }

        setFormData((current) => ({
            ...current,
            locationConfirmed: true,
        }));

        setError('');
    };

    const validateCurrentStep = () => {
        if (currentStep === 1) {
            if (!formData.hospitalName.trim()) {
                return 'Please enter the hospital name.';
            }

            if (!formData.hospitalType) {
                return 'Please select the hospital type.';
            }

            if (!formData.registrationNumber.trim()) {
                return 'Please enter the hospital registration number.';
            }

            if (!formData.registrationAuthority.trim()) {
                return 'Please enter the registration authority.';
            }

            if (!formData.establishedYear) {
                return 'Please enter the hospital establishment year.';
            }

            const establishedYear = Number(
                formData.establishedYear,
            );

            if (
                !Number.isInteger(establishedYear) ||
                establishedYear < LIMITS.establishedYearMin ||
                establishedYear > LIMITS.establishedYearMax
            ) {
                return `Established year must be between ${LIMITS.establishedYearMin} and ${LIMITS.establishedYearMax}.`;
            }
        }

        if (currentStep === 2) {
            if (!formData.officialPhone.trim()) {
                return 'Please enter the official hospital phone number.';
            }

            if (!formData.officialEmail.trim()) {
                return 'Please enter the official hospital email.';
            }

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(formData.officialEmail.trim())) {
                return 'Please enter a valid official hospital email.';
            }

            if (!formData.address.trim()) {
                return 'Please enter the hospital address.';
            }

            if (!formData.city.trim()) {
                return 'Please enter the hospital city.';
            }

            if (!formData.state) {
                return 'Please select the hospital state.';
            }

            if (!formData.pincode.trim()) {
                return 'Please enter the hospital pincode.';
            }

            if (
                !/^\d{6}$/.test(formData.pincode.trim())
            ) {
                return 'Please enter a valid 6-digit pincode.';
            }

            if (!formData.locationConfirmed) {
                return 'Please confirm the hospital location before continuing.';
            }
        }

        if (currentStep === 3) {
            if (!formData.emergencyAvailable) {
                return 'Please specify whether the hospital has an emergency department.';
            }

            if (formData.emergencyAvailable === 'yes') {
                if (!formData.emergencyPhone.trim()) {
                    return 'Please enter the emergency department contact number.';
                }

                if (!formData.traumaCare) {
                    return 'Please specify whether trauma care is available.';
                }
            }
        }

        if (currentStep === 4) {
            if (formData.services.length === 0) {
                return 'Please select at least one hospital service.';
            }
        }

        if (currentStep === 5) {
            const numericFields = [
                {
                    name: 'totalBeds',
                    label: 'Total beds',
                },
                {
                    name: 'emergencyBeds',
                    label: 'Emergency beds',
                },
                {
                    name: 'icuBeds',
                    label: 'ICU beds',
                },
                {
                    name: 'nicuBeds',
                    label: 'NICU beds',
                },
                {
                    name: 'ventilators',
                    label: 'Ventilators',
                },
                {
                    name: 'oxygenBeds',
                    label: 'Oxygen-supported beds',
                },
                {
                    name: 'ambulanceCount',
                    label: 'Total ambulances',
                },
                {
                    name: 'basicLifeSupport',
                    label: 'Basic Life Support ambulances',
                },
                {
                    name: 'advancedLifeSupport',
                    label: 'Advanced Life Support ambulances',
                },
            ];

            for (const field of numericFields) {
                const value = formData[field.name];

                if (value === '') {
                    if (
                        [
                            'totalBeds',
                            'emergencyBeds',
                            'icuBeds',
                            'ambulanceCount',
                            'basicLifeSupport',
                            'advancedLifeSupport',
                        ].includes(field.name)
                    ) {
                        return `Please enter ${field.label.toLowerCase()}.`;
                    }

                    continue;
                }

                const number = Number(value);

                if (
                    !Number.isInteger(number) ||
                    number < 0 ||
                    number > LIMITS.bedsMax
                ) {
                    return `${field.label} must be a whole number between 0 and ${LIMITS.bedsMax.toLocaleString()}.`;
                }
            }

            const totalBeds = Number(formData.totalBeds);
            const emergencyBeds = Number(formData.emergencyBeds);
            const icuBeds = Number(formData.icuBeds);
            const nicuBeds =
                formData.nicuBeds === ''
                    ? 0
                    : Number(formData.nicuBeds);

            const ventilators =
                formData.ventilators === ''
                    ? 0
                    : Number(formData.ventilators);

            const oxygenBeds =
                formData.oxygenBeds === ''
                    ? 0
                    : Number(formData.oxygenBeds);

            const totalAmbulances = Number(
                formData.ambulanceCount,
            );

            const basicLifeSupport = Number(
                formData.basicLifeSupport,
            );

            const advancedLifeSupport = Number(
                formData.advancedLifeSupport,
            );

            if (emergencyBeds > totalBeds) {
                return 'Emergency beds cannot be greater than total beds.';
            }

            if (icuBeds > totalBeds) {
                return 'ICU beds cannot be greater than total beds.';
            }

            if (nicuBeds > totalBeds) {
                return 'NICU beds cannot be greater than total beds.';
            }

            if (oxygenBeds > totalBeds) {
                return 'Oxygen-supported beds cannot be greater than total beds.';
            }

            if (ventilators > totalBeds) {
                return 'Ventilators cannot be greater than total beds.';
            }

            if (
                basicLifeSupport + advancedLifeSupport >
                totalAmbulances
            ) {
                return 'Basic Life Support and Advanced Life Support ambulances cannot exceed total ambulances.';
            }
        }

        if (currentStep === 6) {
            if (!formData.authorizedRepresentative.trim()) {
                return 'Please enter the authorized representative name.';
            }

            if (!formData.designation.trim()) {
                return 'Please enter the representative designation.';
            }

            if (!formData.declarationAccepted) {
                return 'Please accept the authorized representative declaration.';
            }

            if (!formData.termsAccepted) {
                return 'Please accept the verification and platform terms.';
            }
        }

        return '';
    };

    const handleNext = () => {
        const validationError = validateCurrentStep();

        if (validationError) {
            setError(validationError);
            return;
        }

        setError('');

        if (currentStep < STEPS.length) {
            setCurrentStep((current) => current + 1);

            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

    const handleBack = () => {
        setError('');

        if (currentStep > 1) {
            setCurrentStep((current) => current - 1);

            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

    const handleSubmit = () => {
    const validationError = validateCurrentStep();

    if (validationError) {
        setError(validationError);
        return;
    }

    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
        const today = new Date();

        const applicationId = `HSP-${today.getFullYear()}-${Math.floor(
            10000 + Math.random() * 90000,
        )}`;

        const formattedDate = today.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

        const application = {
            applicationId,
            hospitalName: formData.hospitalName,
            submittedAt: formattedDate,
            status: 'PENDING',
            lastUpdated: formattedDate,
        };

        localStorage.setItem(
            'sanjeevani_hospital_verification',
            JSON.stringify(application),
        );

        setIsSubmitting(false);

        navigate('/verification/hospital');
    }, 1200);
};

    const renderInput = ({
        label,
        name,
        type = 'text',
        placeholder,
        required = false,
        className = '',
        min,
        max,
        maxLength,
        autoComplete,
        onChange,
    }) => (
        <div className={className}>
            <label htmlFor={name} className="sj-label">
                {label}
                {required ? ' *' : ''}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={formData[name]}
                onChange={onChange || handleInputChange}
                placeholder={placeholder}
                min={min}
                max={max}
                maxLength={maxLength}
                autoComplete={autoComplete}
                inputMode={
                    type === 'number'
                        ? 'numeric'
                        : undefined
                }
                step={type === 'number' ? '1' : undefined}
                className="sj-input h-12 px-4 text-sm"
            />
        </div>
    );

    const renderSelect = ({
        label,
        name,
        options,
        required = false,
        placeholder = 'Select an option',
    }) => (
        <div>
            <label htmlFor={name} className="sj-label">
                {label}
                {required ? ' *' : ''}
            </label>

            <select
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className="sj-input h-12 px-4 text-sm"
            >
                <option value="">
                    {placeholder}
                </option>

                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );

    const renderYesNo = ({
        label,
        name,
        required = false,
    }) => (
        <div>
            <label className="sj-label">
                {label}
                {required ? ' *' : ''}
            </label>

            <div className="grid grid-cols-2 gap-3">
                {[
                    {
                        value: 'yes',
                        label: 'Yes',
                    },
                    {
                        value: 'no',
                        label: 'No',
                    },
                ].map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                            setFormData((current) => ({
                                ...current,
                                [name]: option.value,
                            }));

                            setError('');
                        }}
                        className={`h-12 rounded-xl border px-4 text-sm font-bold transition ${formData[name] === option.value
                                ? 'border-(--sj-primary) bg-(--sj-primary)/10 text-(--sj-primary)'
                                : 'border-(--sj-border) bg-(--sj-surface) text-(--sj-text-soft) hover:border-(--sj-primary)/40 hover:text-(--sj-text)'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );

    const renderStepContent = () => {
        if (currentStep === 1) {
            return (
                <div className="space-y-6">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-(--sj-primary)">
                            Step 1
                        </p>

                        <h2 className="mt-2 text-2xl font-black tracking-tight text-(--sj-text)">
                            Hospital basic information
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                            Tell us about the healthcare facility you are
                            registering.
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            {renderInput({
                                label: 'Hospital name',
                                name: 'hospitalName',
                                placeholder:
                                    'Enter the official hospital name',
                                required: true,
                            })}
                        </div>

                        {renderSelect({
                            label: 'Hospital type',
                            name: 'hospitalType',
                            options: HOSPITAL_TYPES,
                            required: true,
                        })}

                        {renderInput({
                            label: 'Hospital registration number',
                            name: 'registrationNumber',
                            placeholder:
                                'Enter registration number',
                            required: true,
                        })}

                        {renderInput({
                            label: 'Registration authority',
                            name: 'registrationAuthority',
                            placeholder:
                                'e.g. State Health Department',
                            required: true,
                        })}

                        {renderInput({
                            label: 'Established year',
                            name: 'establishedYear',
                            type: 'number',
                            placeholder: String(CURRENT_YEAR),
                            required: true,
                            min: String(
                                LIMITS.establishedYearMin,
                            ),
                            max: String(
                                LIMITS.establishedYearMax,
                            ),
                            onChange: (event) =>
                                handleNumericChange(
                                    event,
                                    LIMITS.establishedYearMax,
                                ),
                        })}
                    </div>

                    <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                        <div className="flex items-start gap-3">
                            <Info className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-primary)" />

                            <p className="text-xs leading-5 text-(--sj-text-soft)">
                                Registration information will be reviewed by
                                the Sanjeevani AI verification team before
                                your hospital becomes eligible for live
                                emergency coordination.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        if (currentStep === 2) {
            return (
                <div className="space-y-6">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-(--sj-primary)">
                            Step 2
                        </p>

                        <h2 className="mt-2 text-2xl font-black tracking-tight text-(--sj-text)">
                            Contact & location
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                            Provide the official contact and physical
                            location of the hospital.
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        {renderInput({
                            label: 'Official hospital phone',
                            name: 'officialPhone',
                            type: 'tel',
                            placeholder: '+91 11 4000 0000',
                            required: true,
                            autoComplete: 'tel',
                        })}

                        {renderInput({
                            label: 'Official hospital email',
                            name: 'officialEmail',
                            type: 'email',
                            placeholder: 'contact@hospital.com',
                            required: true,
                            autoComplete: 'email',
                        })}

                        <div className="sm:col-span-2">
                            {renderInput({
                                label: 'Complete address',
                                name: 'address',
                                placeholder:
                                    'Building, street, locality',
                                required: true,
                                autoComplete: 'street-address',
                            })}
                        </div>

                        {renderInput({
                            label: 'City',
                            name: 'city',
                            placeholder: 'e.g. New Delhi',
                            required: true,
                            autoComplete: 'address-level2',
                        })}

                        {renderSelect({
                            label: 'State',
                            name: 'state',
                            options: STATES,
                            required: true,
                        })}

                        {renderInput({
                            label: 'Pincode',
                            name: 'pincode',
                            type: 'text',
                            placeholder: '110001',
                            required: true,
                            maxLength:
                                LIMITS.pincodeLength,
                            onChange: (event) => {
                                const value =
                                    event.target.value
                                        .replace(/\D/g, '')
                                        .slice(
                                            0,
                                            LIMITS.pincodeLength,
                                        );

                                setFormData((current) => ({
                                    ...current,
                                    pincode: value,
                                }));

                                setError('');
                            },
                        })}
                    </div>

                    <div className="rounded-2xl border border-(--sj-border) bg-(--sj-surface-2) p-5">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                                <MapPin className="h-5 w-5" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-black text-(--sj-text)">
                                    Hospital location
                                </h3>

                                <div className="mt-4 rounded-xl border border-(--sj-border) bg-(--sj-surface) p-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-(--sj-primary)" />

                                        <div className="min-w-0">
                                            <p className="text-xs font-black uppercase tracking-[0.12em] text-(--sj-text-muted)">
                                                Location information
                                            </p>

                                            <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                                {formData.address &&
                                                    formData.city &&
                                                    formData.state &&
                                                    formData.pincode
                                                    ? `${formData.city}, ${formData.state} ${formData.pincode}`
                                                    : 'Complete the address above'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        confirmHospitalLocation
                                    }
                                    className={`mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-black transition ${formData.locationConfirmed
                                            ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300'
                                            : 'border-(--sj-primary) bg-(--sj-primary)/10 text-(--sj-primary) hover:bg-(--sj-primary)/15'
                                        }`}
                                >
                                    {formData.locationConfirmed ? (
                                        <>
                                            <CheckCircle2 className="h-4 w-4" />
                                            Hospital location confirmed
                                        </>
                                    ) : (
                                        <>
                                            <MapPin className="h-4 w-4" />
                                            Confirm hospital location
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (currentStep === 3) {
            return (
                <div className="space-y-6">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-(--sj-primary)">
                            Step 3
                        </p>

                        <h2 className="mt-2 text-2xl font-black tracking-tight text-(--sj-text)">
                            Emergency services
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                            Help Sanjeevani AI understand whether your
                            hospital can handle emergency cases.
                        </p>
                    </div>

                    <div className="grid gap-5">
                        {renderYesNo({
                            label: 'Do you have a dedicated emergency department?',
                            name: 'emergencyAvailable',
                            required: true,
                        })}

                        {formData.emergencyAvailable ===
                            'yes' ? (
                            <>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    {renderInput({
                                        label: 'Emergency department phone',
                                        name: 'emergencyPhone',
                                        type: 'tel',
                                        placeholder:
                                            '+91 11 4000 0011',
                                        required: true,
                                    })}

                                    <div>
                                        <label className="sj-label">
                                            Emergency operating hours
                                        </label>

                                        <div className="flex h-12 items-center gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) px-4">
                                            <Clock3 className="h-4 w-4 text-(--sj-primary)" />

                                            <span className="text-sm font-bold text-(--sj-text)">
                                                24×7 Emergency Operations
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {renderYesNo({
                                    label: 'Is trauma care available?',
                                    name: 'traumaCare',
                                    required: true,
                                })}
                            </>
                        ) : null}

                        <div>
                            <label
                                htmlFor="emergencyNotes"
                                className="sj-label"
                            >
                                Emergency department notes
                            </label>

                            <textarea
                                id="emergencyNotes"
                                name="emergencyNotes"
                                value={formData.emergencyNotes}
                                onChange={handleInputChange}
                                placeholder="Add any important information about emergency care capabilities."
                                rows={4}
                                className="sj-input resize-none px-4 py-3 text-sm"
                            />
                        </div>
                    </div>
                </div>
            );
        }

        if (currentStep === 4) {
            return (
                <div className="space-y-6">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-(--sj-primary)">
                            Step 4
                        </p>

                        <h2 className="mt-2 text-2xl font-black tracking-tight text-(--sj-text)">
                            Hospital services
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                            Select the medical services your hospital
                            currently provides.
                        </p>
                    </div>

                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm font-black text-(--sj-text)">
                                Available services *
                            </p>

                            <span className="text-xs font-bold text-(--sj-text-muted)">
                                {formData.services.length} selected
                            </span>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {SERVICES.map((service) => {
                                const selected =
                                    formData.services.includes(
                                        service,
                                    );

                                return (
                                    <button
                                        key={service}
                                        type="button"
                                        onClick={() =>
                                            toggleService(service)
                                        }
                                        className={`flex min-h-12 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-bold transition ${selected
                                                ? 'border-(--sj-primary) bg-(--sj-primary)/10 text-(--sj-primary)'
                                                : 'border-(--sj-border) bg-(--sj-surface) text-(--sj-text-soft) hover:border-(--sj-primary)/40 hover:text-(--sj-text)'
                                            }`}
                                    >
                                        <span>{service}</span>

                                        <span
                                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected
                                                    ? 'border-(--sj-primary) bg-(--sj-primary) text-white'
                                                    : 'border-(--sj-border)'
                                                }`}
                                        >
                                            {selected ? (
                                                <Check className="h-3 w-3" />
                                            ) : null}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        }

        if (currentStep === 5) {
            return (
                <div className="space-y-6">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-(--sj-primary)">
                            Step 5
                        </p>

                        <h2 className="mt-2 text-2xl font-black tracking-tight text-(--sj-text)">
                            Capacity & ambulance
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                            Provide your current hospital and ambulance
                            capacity.
                        </p>
                    </div>

                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <BedDouble className="h-5 w-5 text-(--sj-primary)" />

                            <h3 className="text-sm font-black text-(--sj-text)">
                                Hospital capacity
                            </h3>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            {renderInput({
                                label: 'Total beds',
                                name: 'totalBeds',
                                type: 'number',
                                placeholder: 'e.g. 250',
                                required: true,
                                min: '0',
                                max: String(
                                    LIMITS.bedsMax,
                                ),
                                onChange: (event) =>
                                    handleNumericChange(
                                        event,
                                        LIMITS.bedsMax,
                                    ),
                            })}

                            {renderInput({
                                label: 'Emergency beds',
                                name: 'emergencyBeds',
                                type: 'number',
                                placeholder: 'e.g. 30',
                                required: true,
                                min: '0',
                                max: String(
                                    LIMITS.bedsMax,
                                ),
                                onChange: (event) =>
                                    handleNumericChange(
                                        event,
                                        LIMITS.bedsMax,
                                    ),
                            })}

                            {renderInput({
                                label: 'ICU beds',
                                name: 'icuBeds',
                                type: 'number',
                                placeholder: 'e.g. 25',
                                required: true,
                                min: '0',
                                max: String(
                                    LIMITS.bedsMax,
                                ),
                                onChange: (event) =>
                                    handleNumericChange(
                                        event,
                                        LIMITS.bedsMax,
                                    ),
                            })}

                            {renderInput({
                                label: 'NICU beds',
                                name: 'nicuBeds',
                                type: 'number',
                                placeholder: 'e.g. 10',
                                min: '0',
                                max: String(
                                    LIMITS.bedsMax,
                                ),
                                onChange: (event) =>
                                    handleNumericChange(
                                        event,
                                        LIMITS.bedsMax,
                                    ),
                            })}

                            {renderInput({
                                label: 'Ventilators',
                                name: 'ventilators',
                                type: 'number',
                                placeholder: 'e.g. 15',
                                min: '0',
                                max: String(
                                    LIMITS.bedsMax,
                                ),
                                onChange: (event) =>
                                    handleNumericChange(
                                        event,
                                        LIMITS.bedsMax,
                                    ),
                            })}

                            {renderInput({
                                label: 'Oxygen-supported beds',
                                name: 'oxygenBeds',
                                type: 'number',
                                placeholder: 'e.g. 50',
                                min: '0',
                                max: String(
                                    LIMITS.bedsMax,
                                ),
                                onChange: (event) =>
                                    handleNumericChange(
                                        event,
                                        LIMITS.bedsMax,
                                    ),
                            })}
                        </div>
                    </div>

                    <div className="border-t border-(--sj-border) pt-6">
                        <div className="mb-4 flex items-center gap-2">
                            <Ambulance className="h-5 w-5 text-(--sj-primary)" />

                            <h3 className="text-sm font-black text-(--sj-text)">
                                Ambulance availability
                            </h3>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-3">
                            {renderInput({
                                label: 'Total ambulances',
                                name: 'ambulanceCount',
                                type: 'number',
                                placeholder: 'e.g. 5',
                                required: true,
                                min: '0',
                                max: String(
                                    LIMITS.ambulancesMax,
                                ),
                                onChange: (event) =>
                                    handleNumericChange(
                                        event,
                                        LIMITS.ambulancesMax,
                                    ),
                            })}

                            {renderInput({
                                label: 'Basic Life Support',
                                name: 'basicLifeSupport',
                                type: 'number',
                                placeholder: 'e.g. 3',
                                required: true,
                                min: '0',
                                max: String(
                                    LIMITS.ambulancesMax,
                                ),
                                onChange: (event) =>
                                    handleNumericChange(
                                        event,
                                        LIMITS.ambulancesMax,
                                    ),
                            })}

                            {renderInput({
                                label: 'Advanced Life Support',
                                name: 'advancedLifeSupport',
                                type: 'number',
                                placeholder: 'e.g. 2',
                                required: true,
                                min: '0',
                                max: String(
                                    LIMITS.ambulancesMax,
                                ),
                                onChange: (event) =>
                                    handleNumericChange(
                                        event,
                                        LIMITS.ambulancesMax,
                                    ),
                            })}
                        </div>

                        <div className="mt-5">
                            <label
                                htmlFor="ambulanceNotes"
                                className="sj-label"
                            >
                                Ambulance notes
                            </label>

                            <textarea
                                id="ambulanceNotes"
                                name="ambulanceNotes"
                                value={formData.ambulanceNotes}
                                onChange={handleInputChange}
                                placeholder="Add any important information about your ambulance fleet."
                                rows={3}
                                className="sj-input resize-none px-4 py-3 text-sm"
                            />
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-(--sj-primary)">
                        Step 6
                    </p>

                    <h2 className="mt-2 text-2xl font-black tracking-tight text-(--sj-text)">
                        Submit for verification
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-(--sj-text-soft)">
                        Review your information and submit the hospital for
                        Sanjeevani AI verification.
                    </p>
                </div>

                <div className="rounded-2xl border border-(--sj-border) bg-(--sj-surface-2) p-5">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                            <Hospital className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-lg font-black text-(--sj-text)">
                                {formData.hospitalName ||
                                    'Hospital name'}
                            </p>

                            <p className="mt-1 text-sm text-(--sj-text-soft)">
                                {formData.hospitalType ||
                                    'Hospital type'}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="sj-status sj-status-warning">
                                    PENDING VERIFICATION
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface) p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                            Registration
                        </p>

                        <p className="mt-2 text-sm font-bold text-(--sj-text)">
                            {formData.registrationNumber}
                        </p>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            {formData.registrationAuthority}
                        </p>
                    </div>

                    <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface) p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                            Location
                        </p>

                        <p className="mt-2 text-sm font-bold text-(--sj-text)">
                            {formData.city}, {formData.state}
                        </p>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            {formData.pincode}
                        </p>

                        <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Location confirmed
                        </div>
                    </div>

                    <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface) p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                            Emergency
                        </p>

                        <p className="mt-2 text-sm font-bold text-(--sj-text)">
                            {formData.emergencyAvailable ===
                                'yes'
                                ? 'Emergency department available'
                                : 'No dedicated emergency department'}
                        </p>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            {formData.traumaCare === 'yes'
                                ? 'Trauma care available'
                                : 'Trauma care not selected'}
                        </p>
                    </div>

                    <div className="rounded-xl border border-(--sj-border) bg-(--sj-surface) p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-(--sj-text-muted)">
                            Capacity
                        </p>

                        <p className="mt-2 text-sm font-bold text-(--sj-text)">
                            {formData.totalBeds || '0'} total beds
                        </p>

                        <p className="mt-1 text-xs text-(--sj-text-soft)">
                            {formData.icuBeds || '0'} ICU ·{' '}
                            {formData.ambulanceCount || '0'} ambulances
                        </p>
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="authorizedRepresentative"
                        className="sj-label"
                    >
                        Authorized representative *
                    </label>

                    <input
                        id="authorizedRepresentative"
                        name="authorizedRepresentative"
                        type="text"
                        value={
                            formData.authorizedRepresentative
                        }
                        onChange={handleInputChange}
                        placeholder="Enter authorized representative name"
                        className="sj-input h-12 px-4 text-sm"
                    />
                </div>

                <div>
                    <label
                        htmlFor="designation"
                        className="sj-label"
                    >
                        Designation *
                    </label>

                    <input
                        id="designation"
                        name="designation"
                        type="text"
                        value={formData.designation}
                        onChange={handleInputChange}
                        placeholder="e.g. Hospital Director / Administrator"
                        className="sj-input h-12 px-4 text-sm"
                    />
                </div>

                <div className="space-y-3">
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                        <input
                            type="checkbox"
                            name="declarationAccepted"
                            checked={
                                formData.declarationAccepted
                            }
                            onChange={handleInputChange}
                            className="mt-1 h-4 w-4 accent-(--sj-primary)"
                        />

                        <span className="text-sm leading-6 text-(--sj-text-soft)">
                            I confirm that I am authorized to submit this
                            hospital registration and that the information
                            provided is accurate to the best of my knowledge.
                        </span>
                    </label>

                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-(--sj-border) bg-(--sj-surface-2) p-4">
                        <input
                            type="checkbox"
                            name="termsAccepted"
                            checked={formData.termsAccepted}
                            onChange={handleInputChange}
                            className="mt-1 h-4 w-4 accent-(--sj-primary)"
                        />

                        <span className="text-sm leading-6 text-(--sj-text-soft)">
                            I understand that the hospital will remain in
                            <strong className="font-black text-(--sj-text)">
                                {' '}
                                PENDING{' '}
                            </strong>
                            status until the Sanjeevani AI verification team
                            reviews and approves the registration.
                        </span>
                    </label>
                </div>

                <div className="rounded-xl border border-(--sj-primary)/20 bg-(--sj-primary)/5 p-4">
                    <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-(--sj-primary)" />

                        <div>
                            <p className="text-sm font-black text-(--sj-text)">
                                What happens after submission?
                            </p>

                            <p className="mt-1 text-xs leading-5 text-(--sj-text-soft)">
                                Your hospital profile will be submitted for
                                review. The Sanjeevani AI verification team
                                will review the registration information and
                                supporting details. Your hospital will only
                                become eligible for live emergency
                                coordination after approval.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AuthLayout
            eyebrow="Hospital onboarding"
            title="Complete your hospital profile."
            description="Provide the information needed to register your hospital with Sanjeevani AI. Your profile will be reviewed before live emergency coordination is enabled."
        >
            <div>
                <div className="mb-7">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-(--sj-text-muted)">
                                Hospital setup
                            </p>

                            <p className="mt-1 text-sm font-bold text-(--sj-text)">
                                Step {currentStep} of {STEPS.length}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--sj-primary)/10 text-(--sj-primary)">
                            {currentStepData ? (
                                React.createElement(
                                    currentStepData.icon,
                                    {
                                        className: 'h-5 w-5',
                                    },
                                )
                            ) : null}
                        </div>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-(--sj-surface-2)">
                        <div
                            className="h-full rounded-full bg-(--sj-primary) transition-all duration-300"
                            style={{
                                width: `${(currentStep /
                                        STEPS.length) *
                                    100
                                    }%`,
                            }}
                        />
                    </div>
                </div>

                <div className="mb-8 hidden gap-2 md:flex">
                    {STEPS.map((step) => {
                        const Icon = step.icon;
                        const isActive =
                            step.id === currentStep;
                        const isComplete =
                            step.id < currentStep;

                        return (
                            <div
                                key={step.id}
                                className={`flex min-w-0 flex-1 items-center gap-2 ${isActive
                                        ? 'text-(--sj-primary)'
                                        : isComplete
                                            ? 'text-(--sj-text)'
                                            : 'text-(--sj-text-muted)'
                                    }`}
                            >
                                <div
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${isActive
                                            ? 'border-(--sj-primary) bg-(--sj-primary)/10'
                                            : isComplete
                                                ? 'border-(--sj-primary)/30 bg-(--sj-primary)/10'
                                                : 'border-(--sj-border) bg-(--sj-surface-2)'
                                        }`}
                                >
                                    {isComplete ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Icon className="h-4 w-4" />
                                    )}
                                </div>

                                <span className="truncate text-[11px] font-bold">
                                    {step.shortTitle}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="mb-6 md:hidden">
                    <p className="text-sm font-black text-(--sj-text)">
                        {currentStepData?.title}
                    </p>
                </div>

                {renderStepContent()}

                {error ? (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                        {error}
                    </div>
                ) : null}

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-(--sj-border) pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={
                            currentStep === 1 ||
                            isSubmitting
                        }
                        className="flex h-12 items-center justify-center gap-2 rounded-xl border border-(--sj-border) bg-(--sj-surface) px-5 text-sm font-bold text-(--sj-text-soft) transition hover:border-(--sj-primary)/40 hover:text-(--sj-text) disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </button>

                    {currentStep < STEPS.length ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="sj-ai-button h-12 px-6"
                        >
                            Continue
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="sj-ai-button h-12 px-6 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                'Submitting...'
                            ) : (
                                <>
                                    Submit for Verification
                                    <FileCheck2 className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    )}
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-(--sj-text-muted)">
                    <Phone className="h-3.5 w-3.5" />

                    <span>
                        Hospital information can be updated after
                        verification.
                    </span>
                </div>
            </div>
        </AuthLayout>
    );
}

export default HospitalProfileSetup;