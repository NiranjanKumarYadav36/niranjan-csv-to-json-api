import { User, AgeDistribution } from "../types";

export class AgeDistributionService {
    calculateDistribution(users: User[]): AgeDistribution {
        const ageGroups: AgeDistribution = {
            '<20': 0,
            '20-40': 0,
            '40-60': 0,
            '>60': 0
        };

        // Count users in each age group
        users.forEach(user => {
            const age = user.age;

            if (age < 20) {
                ageGroups['<20']++;
            } else if (age >= 20 && age <= 40) {
                ageGroups['20-40']++;
            } else if (age > 40 && age <= 60) {
                ageGroups['40-60']++;
            } else {
                ageGroups['>60']++;
            }
        });

        const totalUsers = users.length;
        const distribution: AgeDistribution = {
            '<20': 0,
            '20-40': 0,
            '40-60': 0,
            '>60': 0
        };

        // Calculate percentages for each group
        for (const [group, count] of Object.entries(ageGroups)) {
            const key = group as keyof AgeDistribution;
            distribution[key] = totalUsers > 0 ?
                Math.round((count / totalUsers) * 100) : 0;
        }

        return distribution;
    }

    printReport(distribution: AgeDistribution): void {
        console.log('\n=== AGE DISTRIBUTION REPORT ===');
        console.log('| Age-Group  | % Distribution |');
        console.log('|------------|----------------|');

        const groups = [
            { key: '<20' as const, label: '< 20' },
            { key: '20-40' as const, label: '20 to 40' },
            { key: '40-60' as const, label: '40 to 60' },
            { key: '>60' as const, label: '> 60' }
        ];

        // Print each row of the table
        for (const group of groups) {
            const percentage = distribution[group.key];
            console.log(`| ${group.label.padEnd(10)} | ${percentage.toString().padEnd(14)} |`);
        }

        console.log('===============================\n');
    }
}