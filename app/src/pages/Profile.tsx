import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SupabaseService from '../services/SupabaseService';
import NotificationManager from '../utils/NotificationManager';
import './Profile.css';

interface UserProfileData {
    height_cm: number;
    weight_kg: number;
    target_weight_kg: number;
    target_duration: number;
    target_duration_unit: string;
    activity_level: string;
    health_goals: string[];
}

type HeightUnit = 'cm' | 'ft';
type WeightUnit = 'kg' | 'lbs';
type DurationUnit = 'days' | 'weeks' | 'months';

const Profile: React.FC = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    
    const [profileData, setProfileData] = useState<UserProfileData>({
        height_cm: 0,
        weight_kg: 0,
        target_weight_kg: 0,
        target_duration: 0,
        target_duration_unit: 'weeks',
        activity_level: 'moderate',
        health_goals: []
    });

    const [isEditing, setIsEditing] = useState(false);
    const [heightUnit, setHeightUnit] = useState<HeightUnit>('cm');
    const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
    const [targetWeightUnit, setTargetWeightUnit] = useState<WeightUnit>('kg');
    const [heightFeet, setHeightFeet] = useState(0);
    const [heightInches, setHeightInches] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasProfile, setHasProfile] = useState(false);

    const getUserName = useCallback(() => {
        if (!user) return '';
        return user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split('@')[0] ||
            'User';
    }, [user]);

    const getUserInitials = useCallback(() => {
        if (!user?.email) return 'U';

        const email = user.email;
        const name = user.user_metadata?.full_name || user.user_metadata?.name;

        if (name) {
            const nameParts = name.trim().split(' ');
            if (nameParts.length >= 2) {
                return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
            }
            return name[0].toUpperCase();
        }

        return email[0].toUpperCase();
    }, [user]);

    useEffect(() => {
        loadUserProfile();
    }, [user]);

    const loadUserProfile = async () => {
        if (!user) return;
        
        try {
            const { data } = await SupabaseService.getUserProfile(user.id);
            
            // Load additional data from localStorage
            let additionalData = { target_weight_kg: 0, target_duration: 0, target_duration_unit: 'weeks' };
            try {
                const stored = localStorage.getItem(`profile_extra_${user.id}`);
                if (stored) {
                    additionalData = JSON.parse(stored);
                }
            } catch (e) {
                console.warn('Failed to load additional profile data:', e);
            }
            
            if (data) {
                setProfileData({
                    height_cm: data.height_cm || 0,
                    weight_kg: data.weight_kg || 0,
                    target_weight_kg: additionalData.target_weight_kg || 0,
                    target_duration: additionalData.target_duration || 0,
                    target_duration_unit: additionalData.target_duration_unit || 'weeks',
                    activity_level: data.activity_level || 'moderate',
                    health_goals: data.health_goals || []
                });
                setHasProfile(true);
                
                if (data.height_cm) {
                    const feet = Math.floor(data.height_cm / 30.48);
                    const inches = Math.round((data.height_cm % 30.48) / 2.54);
                    setHeightFeet(feet);
                    setHeightInches(inches);
                }
            } else {
                // Load from localStorage even if no database profile exists
                setProfileData({
                    height_cm: 0,
                    weight_kg: 0,
                    target_weight_kg: additionalData.target_weight_kg || 0,
                    target_duration: additionalData.target_duration || 0,
                    target_duration_unit: additionalData.target_duration_unit || 'weeks',
                    activity_level: 'moderate',
                    health_goals: []
                });
                setIsEditing(true); // Auto-edit if no profile exists
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const convertHeight = (feet: number, inches: number): number => {
        return Math.round((feet * 30.48) + (inches * 2.54));
    };

    const convertWeight = (value: number, from: WeightUnit, to: WeightUnit): number => {
        if (from === to) return value;
        if (from === 'kg' && to === 'lbs') return Math.round(value * 2.20462 * 10) / 10;
        if (from === 'lbs' && to === 'kg') return Math.round(value / 2.20462 * 10) / 10;
        return value;
    };

    const handleHeightUnitToggle = () => {
        setHeightUnit(prev => prev === 'cm' ? 'ft' : 'cm');
    };

    const handleWeightUnitToggle = () => {
        setWeightUnit(prev => prev === 'kg' ? 'lbs' : 'kg');
    };

    const handleTargetWeightUnitToggle = () => {
        setTargetWeightUnit(prev => prev === 'kg' ? 'lbs' : 'kg');
    };

    const handleInputChange = (field: keyof UserProfileData, value: number | string | string[]) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const validateInputs = (): boolean => {
        if (heightUnit === 'ft') {
            if (heightFeet < 0 || heightFeet > 8 || heightInches < 0 || heightInches >= 12) {
                NotificationManager.getInstance().show('Please enter valid height (0-8 feet, 0-11 inches)', 'error');
                return false;
            }
        } else {
            if (profileData.height_cm < 0 || profileData.height_cm > 250) {
                NotificationManager.getInstance().show('Please enter valid height (0-250 cm)', 'error');
                return false;
            }
        }

        const weightInKg = weightUnit === 'kg' ? profileData.weight_kg : convertWeight(profileData.weight_kg, 'lbs', 'kg');
        if (weightInKg < 0 || weightInKg > 500) {
            NotificationManager.getInstance().show('Please enter valid weight', 'error');
            return false;
        }

        const targetWeightInKg = targetWeightUnit === 'kg' ? profileData.target_weight_kg : convertWeight(profileData.target_weight_kg, 'lbs', 'kg');
        if (targetWeightInKg < 0 || targetWeightInKg > 500) {
            NotificationManager.getInstance().show('Please enter valid target weight', 'error');
            return false;
        }

        if (profileData.target_duration <= 0) {
            NotificationManager.getInstance().show('Please enter valid target duration', 'error');
            return false;
        }

        return true;
    };

    const checkProfileComplete = (data: UserProfileData): boolean => {
        return (
            data.height_cm > 0 &&
            data.weight_kg > 0 &&
            data.target_weight_kg > 0 &&
            data.target_duration > 0 &&
            data.target_duration_unit.length > 0 &&
            data.activity_level.length > 0
        );
    };

    const handleSave = async () => {
        if (!user || !validateInputs()) return;
        
        setIsLoading(true);
        try {
            // Only save fields that exist in the database schema
            const dataToSave: any = {};
            
            // Convert height to cm if in ft/in
            if (heightUnit === 'ft') {
                dataToSave.height_cm = convertHeight(heightFeet, heightInches);
            } else {
                dataToSave.height_cm = profileData.height_cm;
            }
            
            // Convert weight to kg if in lbs
            if (weightUnit === 'lbs') {
                dataToSave.weight_kg = convertWeight(profileData.weight_kg, 'lbs', 'kg');
            } else {
                dataToSave.weight_kg = profileData.weight_kg;
            }
            
            // Add activity level and health goals (these exist in the schema)
            dataToSave.activity_level = profileData.activity_level;
            dataToSave.health_goals = profileData.health_goals;
            
            // Store target weight, target duration, and duration unit in localStorage for now
            // since they don't exist in the current database schema
            const additionalData = {
                target_weight_kg: targetWeightUnit === 'lbs' 
                    ? convertWeight(profileData.target_weight_kg, 'lbs', 'kg')
                    : profileData.target_weight_kg,
                target_duration: profileData.target_duration,
                target_duration_unit: profileData.target_duration_unit
            };
            localStorage.setItem(`profile_extra_${user.id}`, JSON.stringify(additionalData));
            
            const { error } = await SupabaseService.updateUserProfile(user.id, dataToSave);
            
            if (error) {
                throw error;
            }
            
            NotificationManager.getInstance().show('Profile updated successfully!', 'success');
            setIsEditing(false);
            setHasProfile(true);
            
        } catch (error: any) {
            console.error('Error saving profile:', error);
            NotificationManager.getInstance().show(error.message || 'Failed to save profile', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        loadUserProfile();
        setIsEditing(false);
    };

    const handleSignOut = useCallback(async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
            NotificationManager.getInstance().show('Failed to sign out', 'error');
        }
    }, [signOut, navigate]);

    return (
        <div className="profile">
            <div className="profile__container">
                <div className="profile__header">
                    <div className="profile__user">
                        <div className="profile__avatar">
                            <span className="profile__initials">
                                {getUserInitials()}
                            </span>
                        </div>
                        <ul className="profile__info">
                            <li className="profile__name">{getUserName()}</li>
                            <li className="profile__email">{user?.email}</li>
                        </ul>
                    </div>
                    <button
                        className="profile__signout-btn"
                        onClick={handleSignOut}
                        aria-label="Sign out"
                        type="button"
                    >
                        <span className="profile__signout-icon">🚪</span>
                        <span className="profile__signout-text">Sign Out</span>
                    </button>
                </div>

                <div className="profile__content">
                    <div className="profile__section">
                        <div className="profile__section-header">
                            <h2>Setup Profile</h2>
                            {!isEditing && hasProfile && (
                                <button
                                    className="profile__edit-btn"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </button>
                            )}
                        </div>

                        <div className="profile__form">
                            <div className="profile__row">
                                <div className="profile__field-group">
                                    <div className="profile__field-header">
                                        <h3>Height</h3>
                                        <button
                                            type="button"
                                            className="profile__unit-toggle"
                                            onClick={handleHeightUnitToggle}
                                            disabled={!isEditing}
                                        >
                                            {heightUnit === 'cm' ? 'ft/in' : 'cm'}
                                        </button>
                                    </div>
                                    {heightUnit === 'cm' ? (
                                        <div className="profile__input-group">
                                            <input
                                                id="height-cm"
                                                name="height-cm"
                                                type="number"
                                                min="0"
                                                max="250"
                                                value={profileData.height_cm}
                                                onChange={(e) => handleInputChange('height_cm', parseInt(e.target.value) || 0)}
                                                disabled={!isEditing}
                                                placeholder="Height in cm"
                                            />
                                            <span className="profile__unit">cm</span>
                                        </div>
                                    ) : (
                                        <div className="profile__height-row">
                                            <div className="profile__input-group">
                                                <input
                                                    id="height-feet"
                                                    name="height-feet"
                                                    type="number"
                                                    min="0"
                                                    max="8"
                                                    value={heightFeet}
                                                    onChange={(e) => {
                                                        const feet = parseInt(e.target.value) || 0;
                                                        setHeightFeet(feet);
                                                        handleInputChange('height_cm', convertHeight(feet, heightInches));
                                                    }}
                                                    disabled={!isEditing}
                                                    placeholder="Feet"
                                                />
                                                <span className="profile__unit">ft</span>
                                            </div>
                                            <div className="profile__input-group">
                                                <input
                                                    id="height-inches"
                                                    name="height-inches"
                                                    type="number"
                                                    min="0"
                                                    max="11"
                                                    value={heightInches}
                                                    onChange={(e) => {
                                                        const inches = parseInt(e.target.value) || 0;
                                                        setHeightInches(inches);
                                                        handleInputChange('height_cm', convertHeight(heightFeet, inches));
                                                    }}
                                                    disabled={!isEditing}
                                                    placeholder="Inches"
                                                />
                                                <span className="profile__unit">in</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="profile__field-group">
                                    <div className="profile__field-header">
                                        <h3>Weight</h3>
                                        <button
                                            type="button"
                                            className="profile__unit-toggle"
                                            onClick={handleWeightUnitToggle}
                                            disabled={!isEditing}
                                        >
                                            {weightUnit === 'kg' ? 'lbs' : 'kg'}
                                        </button>
                                    </div>
                                    <div className="profile__input-group">
                                        <input
                                            id="weight"
                                            name="weight"
                                            type="number"
                                            min="0"
                                            max={weightUnit === 'kg' ? '500' : '1100'}
                                            step="0.1"
                                            value={weightUnit === 'kg' ? profileData.weight_kg : convertWeight(profileData.weight_kg, 'kg', 'lbs')}
                                            onChange={(e) => {
                                                const value = parseFloat(e.target.value) || 0;
                                                handleInputChange('weight_kg', weightUnit === 'kg' ? value : convertWeight(value, 'lbs', 'kg'));
                                            }}
                                            disabled={!isEditing}
                                            placeholder={`Weight in ${weightUnit}`}
                                        />
                                        <span className="profile__unit">{weightUnit}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="profile__row">
                                <div className="profile__field-group">
                                    <div className="profile__field-header">
                                        <h3>Target Weight</h3>
                                        <button
                                            type="button"
                                            className="profile__unit-toggle"
                                            onClick={handleTargetWeightUnitToggle}
                                            disabled={!isEditing}
                                        >
                                            {targetWeightUnit === 'kg' ? 'lbs' : 'kg'}
                                        </button>
                                    </div>
                                    <div className="profile__input-group">
                                        <input
                                            id="target-weight"
                                            name="target-weight"
                                            type="number"
                                            min="0"
                                            max={targetWeightUnit === 'kg' ? '500' : '1100'}
                                            step="0.1"
                                            value={targetWeightUnit === 'kg' ? profileData.target_weight_kg : convertWeight(profileData.target_weight_kg, 'kg', 'lbs')}
                                            onChange={(e) => {
                                                const value = parseFloat(e.target.value) || 0;
                                                handleInputChange('target_weight_kg', targetWeightUnit === 'kg' ? value : convertWeight(value, 'lbs', 'kg'));
                                            }}
                                            disabled={!isEditing}
                                            placeholder={`Target weight in ${targetWeightUnit}`}
                                        />
                                        <span className="profile__unit">{targetWeightUnit}</span>
                                    </div>
                                </div>

                                <div className="profile__field-group">
                                    <div className="profile__field-header">
                                        <h3>Target Duration</h3>
                                    </div>
                                    <div className="profile__duration-row">
                                        <div className="profile__input-group">
                                            <input
                                                id="target-duration"
                                                name="target-duration"
                                                type="number"
                                                min="1"
                                                max="999"
                                                value={profileData.target_duration}
                                                onChange={(e) => handleInputChange('target_duration', parseInt(e.target.value) || 0)}
                                                disabled={!isEditing}
                                                placeholder="Duration"
                                            />
                                        </div>
                                        <select
                                            id="target-duration-unit"
                                            name="target-duration-unit"
                                            value={profileData.target_duration_unit}
                                            onChange={(e) => handleInputChange('target_duration_unit', e.target.value)}
                                            disabled={!isEditing}
                                            className="profile__select profile__duration-unit"
                                        >
                                            <option value="days">Days</option>
                                            <option value="weeks">Weeks</option>
                                            <option value="months">Months</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="profile__row">
                                <div className="profile__field-group">
                                    <div className="profile__field-header">
                                        <h3>Activity Level</h3>
                                    </div>
                                    <select
                                        id="activity-level"
                                        name="activity-level"
                                        value={profileData.activity_level}
                                        onChange={(e) => handleInputChange('activity_level', e.target.value)}
                                        disabled={!isEditing}
                                        className="profile__select"
                                    >
                                        <option value="sedentary">Sedentary</option>
                                        <option value="light">Light</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="active">Active</option>
                                        <option value="very_active">Very Active</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="profile__actions">
                            {isEditing ? (
                                <>
                                    <button
                                        className={`profile__save-btn ${isLoading ? 'profile__save-btn--loading' : ''}`}
                                        onClick={handleSave}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="profile__loading-spinner"></div>
                                                Updating...
                                            </>
                                        ) : (
                                            hasProfile ? 'Update Profile' : 'Save Profile'
                                        )}
                                    </button>
                                    {hasProfile && (
                                        <button
                                            className="profile__cancel-btn"
                                            onClick={handleCancel}
                                            disabled={isLoading}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </>
                            ) : (
                                hasProfile && (
                                    <button
                                        className="profile__edit-btn"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit Profile
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;