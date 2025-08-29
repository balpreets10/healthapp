# Data and Assets Management

## Overview
This document outlines the management of data files, assets, and static resources used in the health tracking application.

## Data Files Location

### Primary Data Directory
```
data/
├── Website Document.docx          # Project documentation
├── client_secret_*.json          # Google OAuth credentials (sensitive)
└── food_data.csv                 # Food database source data
```

### Application Assets
```
app/
├── public/                       # Static assets served directly
│   ├── data/                    # Public data files
│   └── vite.svg                 # Default Vite logo
├── src/assets/                  # Build-time assets
│   └── react.svg               # React logo
└── home.jpg                    # Homepage hero image
```

## Food Database Management

### Source Data
- **File**: `data/food_data.csv` and `info/food_data.csv`
- **Format**: CSV with nutritional information
- **Size**: 8000+ food items with complete nutritional profiles
- **Import Documentation**: `info/FOOD_DATA_IMPORT.md`

### Data Structure
Food database contains the following fields:
- Food name and description
- Nutritional values (calories, protein, carbs, fats)
- Serving size information
- Category classification
- Additional micronutrients

### Import Process
1. Data validation and cleanup
2. CSV parsing and transformation
3. Database insertion with proper constraints
4. Verification of imported data integrity

### Import Scripts
- **Location**: `info/sql-files-executed/load-food-data.js`
- **Validation**: Data integrity checks before import
- **Error Handling**: Rollback on import failures

## Static Assets Management

### Image Assets
- **Homepage Image**: `app/home.jpg` - Main hero image for homepage
- **Logos and Icons**: Stored in `app/src/assets/` and `app/public/`
- **Optimization**: Build process handles image optimization

### Asset Organization
```
app/public/
├── data/                        # Public data files accessible via URL
├── images/                      # Static images (if needed)
├── icons/                       # App icons and favicons
└── manifest files              # PWA manifests (if applicable)

app/src/assets/
├── images/                      # Build-time processed images
├── icons/                       # Component-specific icons
└── logos/                       # Brand assets
```

## Data Processing Scripts

### Food Data Processing
- **CSV Parsing**: Node.js scripts for data transformation
- **Validation**: Data integrity and format validation
- **Batch Processing**: Efficient bulk data operations
- **Error Logging**: Comprehensive error tracking during import

### Data Transformation
- **Normalization**: Consistent data formats and units
- **Categorization**: Automatic food category assignment
- **Nutritional Calculations**: Derived nutritional values
- **Data Cleaning**: Remove duplicates and invalid entries

## Configuration Data

### Environment-Specific Data
- **Development**: Test data and mock datasets
- **Production**: Full food database and production assets
- **Configuration Files**: Environment-specific data sources

### Sample Data
- **Location**: `app/src/utils/sampleMealData.ts`
- **Purpose**: Development testing and demos
- **Format**: TypeScript objects with type safety

## Asset Optimization

### Build Process
- **Image Optimization**: Automatic compression and format conversion
- **Asset Bundling**: Efficient asset packaging for production
- **Lazy Loading**: On-demand asset loading for performance
- **Caching Strategy**: Browser caching headers for static assets

### Performance Considerations
- **File Size Limits**: Maximum file size guidelines
- **Format Selection**: Optimal formats for different asset types
- **CDN Integration**: Content delivery network for global assets
- **Compression**: Gzip compression for text-based assets

## Security Considerations

### Sensitive Data
- **OAuth Credentials**: `client_secret_*.json` files must be secured
- **Environment Variables**: Sensitive configuration in `.env` files
- **User Data**: All user-generated data must be properly sanitized

### Data Protection
- **Access Controls**: Proper file permissions for sensitive data
- **Version Control**: Never commit sensitive files to git
- **Backup Strategy**: Secure backup procedures for important data

## Data Backup and Recovery

### Backup Strategy
- **Food Database**: Regular backup of imported food data
- **User Assets**: Backup procedures for user-uploaded content
- **Configuration Data**: Version control for configuration files

### Recovery Procedures
- **Data Restoration**: Steps to restore from backups
- **Import Recovery**: Re-import procedures for corrupted data
- **Asset Recovery**: Restore procedures for static assets

## File Upload Management

### User-Generated Content
- **Profile Images**: User avatar upload and processing
- **Meal Photos**: Optional meal photo attachments
- **Custom Food Data**: User-contributed food database entries

### Upload Processing
- **File Validation**: Type, size, and content validation
- **Image Processing**: Automatic resizing and optimization
- **Storage Management**: Efficient file storage and retrieval
- **Security Scanning**: Malware and content scanning

## Data Export and Import

### Export Capabilities
- **User Data Export**: Complete user data export in JSON/CSV
- **Food Database Export**: Export food database for analysis
- **Configuration Export**: Export application configuration

### Import Capabilities
- **Bulk Data Import**: Efficient bulk data import procedures
- **Data Migration**: Import data from other applications
- **Configuration Import**: Import saved application configurations

## Documentation and Metadata

### Data Documentation
- **Schema Documentation**: Complete data structure documentation
- **Field Descriptions**: Detailed field descriptions and validation rules
- **Relationship Mapping**: Data relationship documentation

### Metadata Management
- **File Metadata**: Track file creation, modification, and usage
- **Data Lineage**: Track data source and transformation history
- **Version Information**: Data version tracking and changelog